package com.example.imdbdemo.upload.service;

import com.example.imdbdemo.migration.MigrationService;
import com.example.imdbdemo.migration.MigrationSqlEnum;
import com.example.imdbdemo.migration.exception.MigrationException;
import com.example.imdbdemo.shared.config.props.AppProps;
import com.example.imdbdemo.shared.config.props.AppProps.WebSocketProps.ChunkProps;
import com.example.imdbdemo.shared.constant.DatasetEnum;
import com.example.imdbdemo.shared.exception.ValidationException;
import com.example.imdbdemo.upload.dto.messages.incoming.EofMessageDTO;
import com.example.imdbdemo.upload.dto.messages.incoming.IncomingMessageDTO;
import com.example.imdbdemo.upload.dto.messages.incoming.MetadataMessageDTO;
import com.example.imdbdemo.upload.dto.messages.incoming.ResumeMessageDTO;
import com.example.imdbdemo.upload.dto.messages.outgoing.*;
import com.example.imdbdemo.upload.entity.Upload;
import com.example.imdbdemo.upload.entity.UploadChunk;
import com.example.imdbdemo.upload.entity.UploadErrorCode;
import com.example.imdbdemo.upload.exception.UploadException;
import com.example.imdbdemo.upload.exception.UploadNotFoundException;
import com.example.imdbdemo.upload.exception.UploadUnsupportedException;
import com.example.imdbdemo.upload.repository.UploadRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@RequiredArgsConstructor
@Service
public class UploadService extends AbstractWebSocketHandler {

	private final ObjectMapper objectMapper;
	private final ExecutorService workerExecutor;
	private final AppProps appProps;
	private final UploadRepository uploadRepository;
	private final UploadHelper uploadHelper;

	private final MigrationService migrationService;
	private final JdbcTemplate jdbcTemplate;
	private final Validator validator;

	public void processTextMessage(@NonNull UploadSession uploadSession, @NonNull TextMessage message) {
		IncomingMessageDTO incomingMessage = uploadHelper.parseIncomingMessage(uploadSession, message);
		switch (incomingMessage) {
			case MetadataMessageDTO meta -> startUpload(uploadSession, meta);
			case ResumeMessageDTO res -> resumeUpload(uploadSession, res);
			case EofMessageDTO eof -> commitUpload(uploadSession, eof);
		}
	}

	public void processBinaryMessage(@NonNull UploadSession uploadSession, @NonNull BinaryMessage message) {
		UUID sessionUuid = UUID.fromString(uploadSession.getWebSocketSession().getId());

		Upload upload = uploadSession.getUpload();
		if (upload == null) {
			throw new UploadException(sessionUuid, "Attempted to process binary message before upload was started");
		}

		UploadChunk chunk = uploadHelper.parseUploadChunk(upload, message);
		queueChunk(uploadSession, chunk);
	}

	private void startUpload(@NonNull UploadSession uploadSession, @NonNull MetadataMessageDTO meta) {
		WebSocketSession session = uploadSession.getWebSocketSession();
		UUID sessionUuid = UUID.fromString(session.getId());

		Set<ConstraintViolation<IncomingMessageDTO>> violations = validator.validate(meta);
		if (!CollectionUtils.isEmpty(violations)) {
			throw new ValidationException(violations);
		}

		String dataset = meta.datasetKey();
		if (!DatasetEnum.contains(dataset)) {
			throw new UploadUnsupportedException(sessionUuid, "Dataset key '%s' is not supported".formatted(dataset));
		}

		// Generate new upload UUID
		UUID uploadUuid = UUID.randomUUID();
		uploadHelper.logInfo(
			uploadUuid,
			"Received 'META' message, starting new upload on session '%s'".formatted(sessionUuid)
		);

		// Add upload to database
		Upload upload = Upload.builder()
			.uuid(uploadUuid)
			.datasetKey(dataset)
			.createdDate(Instant.now())
			.chunkByteSize(appProps.ws().chunk().byteSize())
			.chunkAckInterval(appProps.ws().chunk().ackInterval())
			.chunkInFlightMax(appProps.ws().chunk().inFlightMax())
			.fileName(meta.fileName())
			.byteSize(meta.byteSize())
			.lastModified(meta.lastModified())
			.build();
		uploadRepository.save(upload);

		// Ensure temp upload directory exists
		Path path = Path.of(appProps.ul().tempDir(), "%s.bin".formatted(uploadUuid));
		if (!Files.isDirectory(path.getParent())) {
			throw new UploadException(
				uploadUuid,
				"Temporary upload directory '%s' does not exist".formatted(path.getParent())
			);
		}

		// Initialise file channel for writing to temp file and add it to upload session
		FileChannel channel;
		try {
			channel = FileChannel.open(
				path,
				StandardOpenOption.CREATE,
				StandardOpenOption.WRITE,
				StandardOpenOption.TRUNCATE_EXISTING
			);
		} catch (IOException ex) {
			throw new UploadException(uploadUuid, "Failed to open file channel to new upload file", ex);
		}

		// Add upload and file channel to session data
		uploadSession.setUpload(upload);
		uploadSession.setFileChannel(channel);

		// Create upload config
		ConfigMessageDTO config = new ConfigMessageDTO(
			uploadUuid,
			0,
			upload.getChunkByteSize(),
			upload.getChunkAckInterval(),
			upload.getChunkInFlightMax()
		);

		// Send config over WebSocket
		sendMessage(session, uploadUuid, config);
	}

	private void resumeUpload(@NonNull UploadSession uploadSession, @NonNull ResumeMessageDTO res) {
		UUID uploadUuid = res.uuid();
		WebSocketSession session = uploadSession.getWebSocketSession();
		UUID sessionUuid = UUID.fromString(session.getId());

		Set<ConstraintViolation<IncomingMessageDTO>> violations = validator.validate(res);
		if (!CollectionUtils.isEmpty(violations)) {
			throw new ValidationException(violations);
		}

		uploadHelper.logInfo(uploadUuid, "Received 'RES' message, resuming upload on session '%s'".formatted(sessionUuid));

		// Check database for partial upload
		Upload upload = uploadRepository
			.findByUuid(uploadUuid)
			.orElseThrow(() -> new UploadNotFoundException(uploadUuid, "Upload session was not found in database"));

		// Check disk for partial upload
		Path path = uploadHelper
			.findUploadPath(uploadUuid)
			.orElseThrow(() -> new UploadNotFoundException(uploadUuid, "Upload session was not found on disk"));

		// Get partial file size to know where to continue from
		long offset;
		try {
			offset = Files.size(path);
		} catch (IOException ex) {
			throw new UploadException(uploadUuid, "Failed to determine file size of partial upload file", ex);
		}
		// Calculate the chunk index to continue from
		int chunkIndex = (int) (offset / upload.getChunkByteSize());

		// Initialise file channel for writing to temp file and add it to upload session
		FileChannel channel;
		try {
			channel = FileChannel.open(path, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
			channel.position(offset);
		} catch (IOException ex) {
			throw new UploadException(uploadUuid, "Failed to open file channel to partial upload file", ex);
		}

		// Add upload and file channel to session data
		uploadSession.setUpload(upload);
		uploadSession.setFileChannel(channel);

		// Create upload config
		ConfigMessageDTO cfg = new ConfigMessageDTO(
			uploadUuid,
			chunkIndex,
			upload.getChunkByteSize(),
			upload.getChunkAckInterval(),
			upload.getChunkInFlightMax()
		);

		// Send config over WebSocket
		sendMessage(session, uploadUuid, cfg);
	}

	private void commitUpload(@NonNull UploadSession uploadSession, @NonNull EofMessageDTO eof) {
		UUID uploadUuid = eof.uuid();
		WebSocketSession session = uploadSession.getWebSocketSession();
		UUID sessionUuid = UUID.fromString(session.getId());

		Set<ConstraintViolation<IncomingMessageDTO>> violations = validator.validate(eof);
		if (!CollectionUtils.isEmpty(violations)) {
			throw new ValidationException(violations);
		}

		uploadHelper.logInfo(uploadUuid, "Received 'EOF' message, finishing upload on session %s".formatted(sessionUuid));

		// Check upload still exists on disk
		Path path = uploadHelper
			.findUploadPath(uploadUuid)
			.orElseThrow(() -> new UploadNotFoundException(uploadUuid, "Upload session was not found on disk"));

		// Get SQL strings from dataset key
		String datasetKey = uploadSession.getUpload().getDatasetKey();
		DatasetEnum dataset = DatasetEnum.getByValue(datasetKey).orElseThrow(() ->
			new UploadUnsupportedException(uploadUuid, "Dataset key '%s' is not supported".formatted(datasetKey))
		);
		MigrationSqlEnum migrationSql = MigrationSqlEnum.getByDataset(dataset);

		// Attempt to migrate dataset
		uploadHelper.logInfo(uploadUuid, "Beginning migration of '%s' dataset...".formatted(dataset));
		try {
			migrationService.migrate(migrationSql, uploadUuid, path);
		} catch (Exception ex) {
			throw new MigrationException(uploadUuid, dataset, ex);
		}
		uploadHelper.logInfo(uploadUuid, "Successfully migrated '%s' dataset".formatted(dataset));

		// Send end message to frontend
		EndMessageDTO end = new EndMessageDTO();
		sendMessage(session, uploadUuid, end);

		closeSession(session);
	}

	private void queueChunk(@NonNull UploadSession uploadSession, @NonNull UploadChunk chunk) {
		UUID uploadUuid = uploadSession.getUpload().getUuid();

		if (uploadSession.getChunkBuffer().containsKey(chunk.getIndex())) {
			uploadHelper.logInfo(uploadUuid, "Skipping duplicate upload chunk [%s]".formatted(chunk.getIndex()));
			return;
		}
		uploadSession.getChunkBuffer().put(chunk.getIndex(), chunk.getData());

		try {
			drainBuffer(uploadSession);
		} catch (Exception ex) {
			throw new UploadException(uploadUuid, ex.getMessage(), ex);
		}
	}

	private void drainBuffer(@NonNull UploadSession uploadSession) throws IOException {
		if (!uploadSession.getDrainBufferLock().tryLock()) return;

		Upload upload = uploadSession.getUpload();
		if (upload == null) return;

		UUID uploadUuid = upload.getUuid();
		ChunkProps chunkProps = appProps.ws().chunk();
		WebSocketSession session = uploadSession.getWebSocketSession();

		try {
			while (true) {
				int expectedIndex = uploadSession.getNextChunkIndex().get();

				byte[] data = uploadSession.getChunkBuffer().remove(expectedIndex);
				if (ArrayUtils.isEmpty(data)) return;

				uploadHelper.logTrace(uploadUuid, "Received upload chunk [%s]".formatted(expectedIndex));

				long totalChunks = upload.getByteSize() / chunkProps.byteSize();
				if (expectedIndex % chunkProps.ackInterval() == 0 || expectedIndex >= totalChunks) {
					AckMessageDTO ack = new AckMessageDTO(expectedIndex);
					sendMessage(session, uploadUuid, ack);
				}

				ByteBuffer buffer = ByteBuffer.wrap(data);
				while (buffer.hasRemaining()) {
					int _ = uploadSession.getFileChannel().write(buffer);
				}

				uploadSession.getNextChunkIndex().incrementAndGet();
			}
		} finally {
			uploadSession.getDrainBufferLock().unlock();
		}
	}

	public void sendMessage(@NonNull WebSocketSession session, @NonNull UUID uuid, @NonNull OutgoingMessageDTO msg) {
		try {
			session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
			uploadHelper.logDebug(uuid, "Sent '%s' message".formatted(msg.type()));
		} catch (JacksonException ex) {
			sendErrorAndCloseSession(
				session,
				uuid,
				"Failed to stringify '%s' message".formatted(msg.type()),
				UploadErrorCode.SERVER_ERROR
			);
		} catch (IOException ex) {
			sendErrorAndCloseSession(
				session,
				uuid,
				"Failed to send '%s' message".formatted(msg.type()),
				UploadErrorCode.SERVER_ERROR
			);
		}
	}

	public void closeSession(@NonNull WebSocketSession session) {
		UUID sessionUuid = UUID.fromString(session.getId());

		try {
			session.close();
		} catch (IOException ex) {
			throw new UploadException(sessionUuid, "Failed to close WebSocket session", ex);
		}
	}

	public void sendErrorAndCloseSession(
		@NonNull WebSocketSession session,
		@NonNull UUID uuid,
		@NonNull String reason,
		int code
	) {
		ErrorMessageDTO err = new ErrorMessageDTO(code, reason);
		sendMessage(session, uuid, err);
		closeSession(session);
	}

	public void cleanUpSession(@NonNull UploadSession uploadSession, @NonNull CloseStatus status) {
		UUID uploadUuid = uploadSession.getUpload().getUuid();

		String reason = Optional.ofNullable(status.getReason()).orElse("Unknown");
		uploadHelper.logInfo(uploadUuid, "Connection closed with status: %s".formatted(reason));

		uploadSession.getChunkBuffer().clear();
		try {
			uploadSession.getFileChannel().close();
		} catch (IOException ex) {
			throw new UploadException(uploadUuid, "Failed to close file channel", ex);
		}
	}
}
