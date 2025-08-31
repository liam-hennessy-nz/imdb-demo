package com.example.imdbdemo.websockets.upload;

import com.example.imdbdemo.dtos.metadata.ChunkMetadataDTO;
import com.example.imdbdemo.dtos.metadata.FileMetadataDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.*;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

@Slf4j
@Component
public class UploadWebSocketHandler extends AbstractWebSocketHandler {

	private final Map<WebSocketSession, OutputStream> outputStreams = new ConcurrentHashMap<>();
	private final Map<WebSocketSession, Future<?>> copyFutures = new ConcurrentHashMap<>();
	private final Map<WebSocketSession, FileMetadataDTO> files = new ConcurrentHashMap<>();
	private final ExecutorService streamingExecutor;
	private final UploadWebSocketHelper uploadWebSocketHelper;
	private final ObjectMapper objectMapper;

	public UploadWebSocketHandler(
		ExecutorService streamingExecutor,
		UploadWebSocketHelper uploadWebSocketHelper,
		ObjectMapper objectMapper
	) {
		this.streamingExecutor = streamingExecutor;
		this.uploadWebSocketHelper = uploadWebSocketHelper;
		this.objectMapper = objectMapper;
	}

	/**
	 * Method override for AbstractWebSocketHandler's afterConnectionEstablished.
	 *
	 * @param session The session whose connection has been established.
	 */
	@Override
	public void afterConnectionEstablished(@NonNull WebSocketSession session) {
		log.info("WebSocket [{}] - Connection established", session.getId());
	}

	/**
	 * Method override for AbstractWebSocketHandler's afterConnectionClosed.
	 *
	 * @param session The session whose connection has closed.
	 * @param status  The close status of the connection.
	 */
	@Override
	public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
		log.info("WebSocket [{}] - Connection closed", session.getId());

		// Check for related active futures and cancel them
		Future<?> future = copyFutures.remove(session);
		if (future != null) {
			future.cancel(true);
		}

		// Check for related active output streams and remove them
		OutputStream out = outputStreams.remove(session);
		if (out != null) {
			try {
				out.close();
			} catch (IOException e) {
				throw new RuntimeException("Failed to close output stream", e);
			}
		}
	}

	/**
	 * Method override for AbstractWebSocketHandler's handleTextMessage.
	 *
	 * @param session The session which the text message is received on.
	 * @param message The text message.
	 */
	@Override
	protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {
		log.debug("WebSocket [{}] - Received text message: {}", session.getId(), message.getPayload());

		String payload = message.getPayload();

		// If payload is EOF, finish up
		if ("EOF".equals(payload)) {
			uploadWebSocketHelper.handleEof(session, outputStreams);
			return;
		}

		// Attempt to parse FileMetadata from payload
		FileMetadataDTO fileMetadata;
		try {
			fileMetadata = objectMapper.readValue(message.getPayload(), FileMetadataDTO.class);
			files.put(session, fileMetadata);
		} catch (JsonProcessingException e) {
			// Log and close connection if exception is caught
			log.error("WebSocket [{}] - Failed to parse file metadata: {}", session.getId(), e.getMessage(), e);
			uploadWebSocketHelper.closeConnection(session, CloseStatus.SERVER_ERROR);
			return;
		}

		// Match SQL to use in PostgreSQL COPY based on filename in metadata
		String copySql = uploadWebSocketHelper.determineCopySql(fileMetadata.getFileName());
		if (copySql == null) {
			uploadWebSocketHelper.closeConnection(session, CloseStatus.BAD_DATA);
			return;
		}

		// Attempt to set up I/O streams for piping to PostgreSQL COPY
		PipedOutputStream pipedOut = new PipedOutputStream();
		PipedInputStream pipedIn;
		try {
			pipedIn = new PipedInputStream(pipedOut);
		} catch (IOException e) {
			// Log and close connection if exception is caught
			log.error("WebSocket [{}] - Failed to open piped input stream: {}", session.getId(), e.getMessage(), e);
			uploadWebSocketHelper.closeConnection(session, CloseStatus.SERVER_ERROR);
			return;
		}
		BufferedOutputStream bufferedOut = new BufferedOutputStream(pipedOut);
		outputStreams.put(session, bufferedOut);

		// Create future for upload which asynchronously runs PostgreSQL CopyManager consuming InputStream
		CompletableFuture<Void> future = CompletableFuture.runAsync(
			() -> uploadWebSocketHelper.pipeInputStreamToCopy(copySql, pipedIn),
			streamingExecutor
		).whenComplete((result, throwable) -> {
			if (throwable != null) {
				// Log and close connection if exception is caught
				log.error("WebSocket [{}] - Upload COPY failed: {}", session.getId(), throwable.getMessage(), throwable);
				uploadWebSocketHelper.closeConnection(session, CloseStatus.SERVER_ERROR);
			}
		});
		copyFutures.put(session, future);

		// No exceptions, COPY is running
		log.info("WebSocket [{}] - Upload COPY started", session.getId());
	}

	/**
	 * Method override for AbstractWebSocketHandler's handleBinaryMessage.
	 *
	 * @param session The session which the binary message is received on.
	 * @param message The binary message.
	 */
	@Override
	protected void handleBinaryMessage(@NonNull WebSocketSession session, @NonNull BinaryMessage message) {
		log.debug("WebSocket [{}] - Received binary message: {}", session.getId(), message.getPayload());

		// Match output stream to session via map
		OutputStream out = outputStreams.get(session);
		// If no output stream found (i.e. binary message sent before metadata)
		if (out == null) {
			// Close the session
			uploadWebSocketHelper.closeConnection(session, CloseStatus.BAD_DATA);
			return;
		}

		// Parse chunk index from first 4 bytes (big-endian)
		int chunkIndex = message.getPayload().getInt();
		log.info("WebSocket [{}] - Received binary message for chunk [{}]", session.getId(), chunkIndex);

		int ackFrequency = files.get(session).getAckInterval();
		int totalChunks = files.get(session).getTotalChunks();
		if (chunkIndex % ackFrequency == 0 || chunkIndex == totalChunks - 1) {
			ChunkMetadataDTO chunkMetadataDTO = ChunkMetadataDTO.builder()
				.type("ACK")
				.chunkIndex(chunkIndex)
				.build();

			// Attempt to send ACK back to frontend
			try {
				session.sendMessage(new TextMessage(objectMapper.writeValueAsString(chunkMetadataDTO)));
				log.info("WebSocket [{}] - Sent ACK for chunk [{}]", session.getId(), chunkIndex);
			} catch (JsonProcessingException e) {
				// Log and close connection if exception is caught
				log.error("WebSocket [{}] - Failed to convert ChunkMetadata to String: {}", session.getId(), e.getMessage(), e);
				uploadWebSocketHelper.closeConnection(session, CloseStatus.SERVER_ERROR);
			} catch (IOException e) {
				// Log and close connection if exception is caught
				log.error("WebSocket [{}] - Failed to send message via WebSocket: {}", session.getId(), e.getMessage(), e);
				uploadWebSocketHelper.closeConnection(session, CloseStatus.SERVER_ERROR);
			}
		}

		// Get chunk data
		byte[] data = new byte[message.getPayload().remaining()];
		message.getPayload().get(data);

		// Attempt to write chunk to OutputStream
		try {
			out.write(data);
		} catch (IOException e) {
			// Log and close connection if exception is caught
			log.error("WebSocket [{}] - Failed to write payload to OutputStream: {}", session.getId(), e.getMessage(), e);
			uploadWebSocketHelper.closeConnection(session, CloseStatus.SERVER_ERROR);
		}
	}
}
