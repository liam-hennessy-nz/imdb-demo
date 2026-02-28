package com.example.imdbdemo.websocket.upload;

import com.example.imdbdemo.shared.config.props.AppProps;
import com.example.imdbdemo.shared.config.props.AppProps.WebSocketProps.ChunkProps;
import com.example.imdbdemo.websocket.upload.dto.UploadChunkDTO;
import com.example.imdbdemo.websocket.upload.dto.UploadSessionDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.EofMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.MetadataMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.ResumeMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.outgoing.*;
import com.example.imdbdemo.websocket.upload.exception.UploadException;
import com.example.imdbdemo.websocket.upload.exception.UploadInterruptedException;
import com.example.imdbdemo.websocket.upload.exception.UploadNotFoundException;
import com.example.imdbdemo.websocket.upload.exception.UploadUnsupportedException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class UploadService extends AbstractWebSocketHandler {
	private final Map<WebSocketSession, UploadSessionDTO> uploadSessions = new ConcurrentHashMap<>();

	private final ObjectMapper objectMapper;
	private final ExecutorService workerExecutor;
	private final AppProps appProps;
	private final UploadRepository uploadRepository;
	private final UploadHelper uploadHelper;

	public UploadService(ObjectMapper objectMapper, ExecutorService workerExecutor, AppProps appProps, UploadRepository uploadRepository, UploadHelper uploadHelper) {
		this.appProps = appProps;
		this.objectMapper = objectMapper;
		this.workerExecutor = workerExecutor;
		this.uploadRepository = uploadRepository;
		this.uploadHelper = uploadHelper;
	}

	public void startUpload(@NonNull WebSocketSession session, @NonNull MetadataMessageDTO meta) {
		// Generate new UUID for this upload
		UUID uuid = UUID.randomUUID();
		uploadHelper.logInfo(uuid, "META received, starting new upload on session '%s'".formatted(session.getId()));

		// TODO: validate meta

		// Add upload to database
		Upload upload = Upload.builder().id(uuid).datasetKey(meta.datasetKey()).createdDate(Instant.now()).chunkByteSize(appProps.ws().chunk().byteSize()).chunkAckInterval(appProps.ws().chunk().ackInterval()).chunkInFlightMax(appProps.ws().chunk().inFlightMax()).byteSize(meta.byteSize()).lastModified(meta.lastModified()).build();
		uploadRepository.save(upload);

		// Ensure temp upload directory exists
		Path path = Path.of(appProps.ul().tempDir(), "%s.bin".formatted(uuid));
		if (!Files.isDirectory(path.getParent())) {
			throw new UploadException(uuid, "Temporary upload directory '%s' does not exist".formatted(path.getParent()));
		}

		// Initialise file channel for writing to temp file and add it to upload session
		FileChannel channel;
		try {
			channel = FileChannel.open(path, StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
		} catch (IOException ex) {
			throw new UploadException(uuid, "Failed to open file channel to new upload file", ex);
		}
		// Create new upload session and add it to map by UUID
		UploadSessionDTO uploadSession = uploadHelper.generateNewUploadSession(upload, channel);
		uploadSessions.put(session, uploadSession);

		// If not already running, get worker to begin listening for new chunks on a separate thread
		if (uploadSession.isWorkerRunning.compareAndSet(false, true)) {
			workerExecutor.submit(() -> startUploadChunkWorker(session, uploadSession));
		}

		// Create upload config
		ConfigMessageDTO config = new ConfigMessageDTO(uuid, upload.getDatasetKey(), 0, upload.getChunkByteSize(), upload.getChunkAckInterval(), upload.getChunkInFlightMax());

		// Send config over WebSocket
		sendMessage(session, uuid, config);
	}

	public void resumeUpload(@NonNull WebSocketSession session, @NonNull ResumeMessageDTO res) {
		// Retrieve existing UUID of this partial upload
		UUID uuid = res.uuid();
		uploadHelper.logInfo(uuid, "RES received, resuming upload on session '%s'".formatted(session.getId()));

		// TODO: validate res

		// Check database for partial upload
		Upload upload = uploadRepository.findById(uuid).orElseThrow(() -> new UploadNotFoundException(uuid, "Upload " + "session was not found in database"));

		// Check disk for partial upload
		Path path = uploadHelper.findUploadPath(uuid).orElseThrow(() -> new UploadNotFoundException(uuid, "Upload" + " session was not found on disk"));

		// Get partial file size to know where to continue from
		long offset;
		try {
			offset = Files.size(path);
		} catch (IOException ex) {
			throw new UploadException(uuid, "Failed to determine file size of partial upload file", ex);
		}
		// Calculate the chunk index to continue from
		int chunkIndex = (int) (offset / upload.getChunkByteSize());

		// Initialise file channel for writing to temp file and add it to upload session
		FileChannel channel;
		try {
			channel = FileChannel.open(path, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
			channel.position(offset);
		} catch (IOException ex) {
			throw new UploadException(uuid, "Failed to open file channel to partial upload file", ex);
		}
		// Recreate upload session add it to map by UUID
		UploadSessionDTO uploadSession = uploadHelper.generateNewUploadSession(upload, channel);
		uploadSessions.put(session, uploadSession);

		// If not already running, get worker to begin listening for new chunks on a separate thread
		if (uploadSession.isWorkerRunning.compareAndSet(false, true)) {
			workerExecutor.submit(() -> startUploadChunkWorker(session, uploadSession));
		}

		// Create upload config
		ConfigMessageDTO cfg = new ConfigMessageDTO(uuid, upload.getDatasetKey(), chunkIndex, upload.getChunkByteSize(), upload.getChunkAckInterval(), upload.getChunkInFlightMax());

		// Send config over WebSocket
		sendMessage(session, uuid, cfg);
	}

	public void commitUpload(@NonNull WebSocketSession session, @NonNull EofMessageDTO eof) {
		// Retrieve existing UUID of this partial upload
		UUID uuid = eof.uuid();
		uploadHelper.logInfo(uuid, "EOF received, beginning COPY");

		// Check session still exists in memory
		UploadSessionDTO uploadSession = Optional.ofNullable(uploadSessions.get(session)).orElseThrow(() -> new UploadNotFoundException(uuid, "Upload session was not found in memory"));
		uploadSession.isEofReceived.set(true);

		// Check upload still exists on disk
		Path path = uploadHelper.findUploadPath(uuid).orElseThrow(() -> new UploadNotFoundException(uuid, "Upload session was not found on disk"));

		String tableName = uploadSession.getUpload().getDatasetKey();
		String copySql = Optional.ofNullable(uploadHelper.determineCopySql(tableName)).orElseThrow(() ->
			new UploadUnsupportedException(uuid, "Table name '%s' is not supported".formatted(tableName))
		);

		try {
			uploadHelper.copyFromFileToDatabase(path, copySql);
		} catch (UploadException ex) {
			throw new UploadException(uuid, "Failed to commit upload to database", ex);
		}

		uploadHelper.logInfo(uuid, "COPY completed successfully");

		// Send end message to frontend
		EndMessageDTO end = new EndMessageDTO();
		sendMessage(session, uuid, end);

		closeSession(session);
	}

	public void queueUploadChunk(@NonNull WebSocketSession session, @NonNull UploadChunkDTO chunk) {
		// Check session still exists in memory
		UploadSessionDTO uploadSession = Optional.ofNullable(uploadSessions.get(session)).orElseThrow(() -> new UploadNotFoundException(UUID.fromString(session.getId()), "Upload session was not found in memory"));

		UUID uuid = uploadSession.getUpload().getId();
		if (uploadSession.chunkQueue.contains(chunk)) {
			uploadHelper.logInfo(uuid, "Upload chunk [%s] already in queue, skipping".formatted(chunk.getIndex()));
			return;
		}

		try {
			uploadSession.chunkQueue.put(chunk);
		} catch (InterruptedException ex) {
			throw new UploadException(uuid, "Failed to enqueue binary message", ex);
		}
	}

	public void startUploadChunkWorker(@NonNull WebSocketSession session, @NonNull UploadSessionDTO uploadSession) {
		ChunkProps chunkProps = appProps.ws().chunk();
		Upload upload = uploadSession.getUpload();
		UUID uuid = upload.getId();

		try {
			while (true) {
				UploadChunkDTO chunk;
				try {
					chunk = uploadSession.chunkQueue.poll(100, TimeUnit.MILLISECONDS);
				} catch (InterruptedException ex) {
					throw new UploadException(uuid, "Thread was interrupted while waiting to poll for a new chunk", ex);
				}

				if (chunk == null) {
					// Queue is empty and EOF received - break out of loop
					if (uploadSession.isEofReceived.get()) {
						break;
					}
					// Queue is empty and session is closed - throw exception
					if (!session.isOpen()) {
						throw new UploadInterruptedException(uuid, "Upload session ended before EOF was received");
					}
					// Queue is empty and EOF not yet received - poll again
					continue;
				}
				uploadHelper.logInfo(uuid, "Received chunk index '%s'".formatted(chunk.getIndex()));

				long totalChunks = upload.getByteSize() / chunkProps.byteSize();
				if (chunk.index % chunkProps.ackInterval() == 0 || chunk.index == totalChunks - 1) {
					AckMessageDTO ack = new AckMessageDTO(chunk.getIndex());
					sendMessage(session, uuid, ack);
				}

				try {
					ByteBuffer buffer = ByteBuffer.wrap(chunk.data);
					while (buffer.hasRemaining()) {
						int ignored = uploadSession.fileChannel.write(buffer);
					}
				} catch (IOException ex) {
					throw new UploadException(uuid, "Failed to write chunk data to disk", ex);
				}
			}
		} catch (UploadInterruptedException ex) {
			uploadHelper.logInfo(uuid, ex.getMessage());
		} catch (UploadException ex) {
			uploadHelper.logError(uuid, ex.getMessage(), ex);
		}
	}

	public void sendMessage(@NonNull WebSocketSession session, @NonNull UUID uuid, @NonNull OutgoingMessageDTO msg) {
		try {
			session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
			uploadHelper.logInfo(uuid, "Sent '%s' message".formatted(msg.type()));
		} catch (JacksonException ex) {
			sendErrorAndCloseSession(session, uuid, "Failed to stringify '%s' message".formatted(msg.type()), UploadErrorCode.SERVER_ERROR);
		} catch (IOException ex) {
			sendErrorAndCloseSession(session, uuid, "Failed to send '%s' message".formatted(msg.type()), UploadErrorCode.SERVER_ERROR);
		}
	}

	public void closeSession(@NonNull WebSocketSession session) {
		UploadSessionDTO uploadSession = Optional.ofNullable(uploadSessions.get(session)).orElseThrow(() -> new UploadNotFoundException(UUID.fromString(session.getId()), "Upload session was not found in memory"));
		UUID uuid = uploadSession.getUpload().getId();

		try {
			session.close();
		} catch (IOException ex) {
			throw new UploadException(uuid, "Failed to close WebSocket session", ex);
		}
	}

	public void sendErrorAndCloseSession(@NonNull WebSocketSession session, @NonNull UUID uuid, @NonNull String reason, int code) {
		ErrorMessageDTO err = new ErrorMessageDTO(code, reason);
		sendMessage(session, uuid, err);
		closeSession(session);
	}

	public void cleanUpSession(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
		UploadSessionDTO uploadSession = Optional.ofNullable(uploadSessions.get(session)).orElseThrow(() -> new UploadNotFoundException(UUID.fromString(session.getId()), "Upload session was not found in memory"));
		UUID uuid = uploadSession.getUpload().getId();

		String reason = Optional.ofNullable(status.getReason()).orElse("Unknown");
		uploadHelper.logInfo(uuid, "Connection closed with status: %s".formatted(reason));

		uploadSession.chunkQueue.clear();
		uploadSession.chunkQueue = null;
		try {
			uploadSession.fileChannel.close();
		} catch (IOException ex) {
			throw new UploadException(uuid, "Failed to close file channel", ex);
		}
		uploadSession.fileChannel = null;

		uploadSessions.remove(session);
	}
}
