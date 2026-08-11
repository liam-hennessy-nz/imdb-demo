package com.example.imdbdemo.upload.service;

import com.example.imdbdemo.upload.entity.UploadErrorCode;
import com.example.imdbdemo.upload.exception.UploadException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

@RequiredArgsConstructor
@Component
public class UploadHandler extends AbstractWebSocketHandler {

	private final ExecutorService messageExecutor;
	private final UploadService uploadService;
	private final UploadHelper uploadHelper;

	// Map of upload sessions by WebSocket session UUID
	private final Map<UUID, UploadSession> sessions = new ConcurrentHashMap<>();

	@Override
	public void afterConnectionEstablished(@NonNull WebSocketSession session) {
		UUID sessionId = UUID.fromString(session.getId());

		uploadHelper.logInfo(sessionId, "Connection established");
		WebSocketSession concurrentSession = new ConcurrentWebSocketSessionDecorator(session, 30_000, 4 * 1024 * 1024);
		sessions.put(sessionId, new UploadSession(concurrentSession));
	}

	@Override
	public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
		UUID sessionId = UUID.fromString(session.getId());

		UploadSession uploadSession = sessions.remove(sessionId);
		if (uploadSession == null) return;

		try {
			uploadService.cleanUpSession(uploadSession, status);
			sessions.remove(sessionId);
		} catch (UploadException ex) {
			uploadHelper.logError(ex.getUuid(), ex.getMessage(), ex);
		} catch (Exception ex) {
			uploadHelper.logError(sessionId, ex.getMessage(), ex);
		}
	}

	@Override
	protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {
		UUID sessionId = UUID.fromString(session.getId());

		UploadSession uploadSession = sessions.get(sessionId);
		if (uploadSession == null) {
			uploadService.sendErrorAndCloseSession(
				session,
				sessionId,
				"Failed to find active upload session",
				UploadErrorCode.NOT_FOUND
			);
			return;
		}

		messageExecutor.submit(() -> {
			try {
				uploadService.processTextMessage(uploadSession, message);
			} catch (Exception ex) {
				uploadHelper.logError(sessionId, ex.getMessage(), ex);
			}
		});
	}

	@Override
	protected void handleBinaryMessage(@NonNull WebSocketSession session, @NonNull BinaryMessage message) {
		UUID sessionId = UUID.fromString(session.getId());

		UploadSession uploadSession = sessions.get(sessionId);
		if (uploadSession == null) {
			uploadService.sendErrorAndCloseSession(
				session,
				sessionId,
				"Failed to find active upload session",
				UploadErrorCode.NOT_FOUND
			);
			return;
		}

		messageExecutor.submit(() -> {
			try {
				uploadService.processBinaryMessage(uploadSession, message);
			} catch (Exception ex) {
				uploadHelper.logError(sessionId, ex.getMessage(), ex);
			}
		});
	}
}
