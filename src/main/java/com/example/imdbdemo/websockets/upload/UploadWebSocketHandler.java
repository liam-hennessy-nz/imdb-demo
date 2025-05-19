package com.example.imdbdemo.websockets.upload;

import com.example.imdbdemo.config.props.DatabaseProps;
import com.example.imdbdemo.dtos.FileMetadata;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import javax.sql.DataSource;
import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.sql.Connection;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

@Slf4j
@Component
public class UploadWebSocketHandler extends AbstractWebSocketHandler {

	private final Map<WebSocketSession, OutputStream> outputStreams = new ConcurrentHashMap<>();
	private final Map<WebSocketSession, Future<?>> copyFutures = new ConcurrentHashMap<>();
	private final ExecutorService streamingExecutor;
	private final DataSource dataSource;
	private final DatabaseProps databaseProps;
	private final JdbcTemplate jdbcTemplate;
	private final UploadWebSocketHelper uploadWebSocketHelper;

	public UploadWebSocketHandler(ExecutorService streamingExecutor, DataSource dataSource, DatabaseProps databaseProps, JdbcTemplate jdbcTemplate, UploadWebSocketHelper uploadWebSocketHelper) {
		this.streamingExecutor = streamingExecutor;
		this.dataSource = dataSource;
		this.databaseProps = databaseProps;
		this.jdbcTemplate = jdbcTemplate;
		this.uploadWebSocketHelper = uploadWebSocketHelper;
	}

	@Override
	public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
		log.info("Upload WebSocket [{}] established", session.getId());
	}

	@Override
	public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
		log.info("Upload WebSocket [{}] closed: {}", session.getId(), status.getReason());

		closeCopy(session);
	}

	@Override
	protected void handleBinaryMessage(@NonNull WebSocketSession session, @NonNull BinaryMessage message) throws Exception {
		// log.info("Upload WebSocket [{}] received binary message: {}", session.getId(), message.getPayload());

		// Match output stream to session via map
		OutputStream out = outputStreams.get(session);

		// If no output stream found (i.e. binary message sent before metadata)
		if (out == null) {
			// Close the session
			session.close(CloseStatus.BAD_DATA);
			return;
		}

		// Get bytes from this chunk
		byte[] data = message.getPayload().array();

		if (new String(data).equals("EOF")) {
			try {
				out.flush();
				out.close();
				log.info("Upload WebSocket [{}] ended", session.getId());
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
			return;
		}

		try {
			out.write(data);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			session.close(CloseStatus.SERVER_ERROR);
		}
	}

	@Override
	protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
		 // log.info("Upload WebSocket [{}] received text message: {}", session.getId(), message.getPayload());

		// Attempt to initialise streams
		try {
			// First message should be file metadata
			ObjectMapper objectMapper = new ObjectMapper();
			FileMetadata fileMetadata = objectMapper.readValue(message.getPayload(), FileMetadata.class);

			String copySql = uploadWebSocketHelper.determineCopySql(fileMetadata.getFileName());
			if (copySql == null) {
				session.close(CloseStatus.BAD_DATA);
				return;
			}

			PipedOutputStream pipedOut = new PipedOutputStream();
			PipedInputStream pipedIn = new PipedInputStream(pipedOut);
			BufferedOutputStream bufferedOut = new BufferedOutputStream(pipedOut);

			outputStreams.put(session, bufferedOut);

			Future<?> future = streamingExecutor.submit(() -> {
				try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
					PGConnection pgConn = conn.unwrap(PGConnection.class);
					CopyManager copyManager = pgConn.getCopyAPI();
					copyManager.copyIn(copySql, pipedIn);
					log.info("Upload WebSocket [{}] copied", session.getId());
				} catch (Exception e) {
					log.error(e.getMessage(), e);
					try {
						session.close(CloseStatus.SERVER_ERROR);
					} catch (Exception ignore) {}
				}
			});

			copyFutures.put(session, future);
			log.info("Upload WebSocket [{}] started", session.getId());

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			session.close(CloseStatus.BAD_DATA);
		}
	}

	private void closeCopy(WebSocketSession session) throws Exception {
		OutputStream out = outputStreams.remove(session);
		if (out != null) {
			try {
				out.close();
			} catch (Exception ignore) {}
		}

		Future<?> future = copyFutures.remove(session);
		if (future != null) {
			future.cancel(true);
		}
	}
}
