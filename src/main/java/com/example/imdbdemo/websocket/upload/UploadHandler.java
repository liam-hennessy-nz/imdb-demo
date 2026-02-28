package com.example.imdbdemo.websocket.upload;

import com.example.imdbdemo.websocket.upload.dto.UploadChunkDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.EofMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.IncomingMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.MetadataMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.ResumeMessageDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.outgoing.ErrorMessageDTO;
import com.example.imdbdemo.websocket.upload.exception.UploadException;
import com.example.imdbdemo.websocket.upload.exception.UploadNotFoundException;
import com.example.imdbdemo.websocket.upload.exception.UploadUnsupportedException;
import lombok.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;

@Component
public class UploadHandler extends AbstractWebSocketHandler {
	private final ExecutorService messageExecutor;
	private final UploadService uploadService;
	private final UploadHelper uploadHelper;

	private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

	public UploadHandler(ExecutorService messageExecutor, UploadHelper uploadHelper, UploadService uploadService) {
		this.messageExecutor = messageExecutor;
		this.uploadService = uploadService;
		this.uploadHelper = uploadHelper;
	}

	@Override
	public void afterConnectionEstablished(@NonNull WebSocketSession session) {
		uploadHelper.logInfo(UUID.fromString(session.getId()), "Connection established");
		WebSocketSession concurrentSession = new ConcurrentWebSocketSessionDecorator(session, 30_000, 4 * 1024 * 1024);
		sessions.put(session.getId(), concurrentSession);
	}

	@Override
	public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
		WebSocketSession concurrentSession = sessions.remove(session.getId());
		try {
			uploadService.cleanUpSession(concurrentSession, status);
		} catch (UploadNotFoundException ex) {
			uploadHelper.logWarn(ex.getUuid(), ex.getMessage());
		} catch (UploadException ex) {
			uploadHelper.logError(ex.getUuid(), ex.getMessage(), ex);
		}
	}

	@Override
	protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {
		WebSocketSession concurrentSession = sessions.get(session.getId());

		messageExecutor.submit(() -> processText(concurrentSession, message));
	}

	private void processText(@NonNull WebSocketSession session, @NonNull TextMessage message) {
		WebSocketSession concurrentSession = sessions.get(session.getId());

		IncomingMessageDTO incomingMessage;
		try {
			incomingMessage = uploadHelper.parseIncomingMessage(concurrentSession, message);
		} catch (UploadUnsupportedException ex) {
			uploadHelper.logWarn(ex.getUuid(), ex.getMessage());
			uploadService.sendErrorAndCloseSession(concurrentSession, ex.getUuid(), ex.getMessage(), UploadErrorCode.BAD_REQUEST);
			return;
		} catch (UploadException ex) {
			uploadHelper.logError(ex.getUuid(), ex.getMessage(), ex);
			uploadService.sendErrorAndCloseSession(concurrentSession, ex.getUuid(), ex.getMessage(), UploadErrorCode.SERVER_ERROR);
			return;
		}

		try {
			switch (incomingMessage) {
				case MetadataMessageDTO meta -> uploadService.startUpload(concurrentSession, meta);
				case ResumeMessageDTO res -> uploadService.resumeUpload(concurrentSession, res);
				case EofMessageDTO eof -> uploadService.commitUpload(concurrentSession, eof);
			}
		} catch (UploadNotFoundException ex) {
			uploadHelper.logWarn(ex.getUuid(), ex.getMessage());
			ErrorMessageDTO err = new ErrorMessageDTO(UploadErrorCode.NOT_FOUND, ex.getMessage());
			uploadService.sendMessage(concurrentSession, ex.getUuid(), err);
		} catch (UploadUnsupportedException ex) {
			uploadHelper.logWarn(ex.getUuid(), ex.getMessage());
			uploadService.sendErrorAndCloseSession(concurrentSession, ex.getUuid(), ex.getMessage(), UploadErrorCode.BAD_REQUEST);
		} catch (UploadException ex) {
			uploadHelper.logError(ex.getUuid(), ex.getMessage(), ex);
			uploadService.sendErrorAndCloseSession(concurrentSession, ex.getUuid(), ex.getMessage(), UploadErrorCode.SERVER_ERROR);
		}
	}

	@Override
	protected void handleBinaryMessage(@NonNull WebSocketSession session, @NonNull BinaryMessage message) {
		WebSocketSession concurrentSession = sessions.get(session.getId());

		messageExecutor.submit(() -> processBinary(concurrentSession, message));
	}

	private void processBinary(@NonNull WebSocketSession session, @NonNull BinaryMessage message) {
		WebSocketSession concurrentSession = sessions.get(session.getId());

		UploadChunkDTO uploadChunk;
		try {
			uploadChunk = uploadHelper.parseUploadChunk(concurrentSession, message);
		} catch (UploadUnsupportedException ex) {
			uploadHelper.logWarn(ex.getUuid(), ex.getMessage());
			uploadService.sendErrorAndCloseSession(concurrentSession, ex.getUuid(), ex.getMessage(), UploadErrorCode.BAD_REQUEST);
			return;
		}

		try {
			uploadService.queueUploadChunk(concurrentSession, uploadChunk);
		} catch (UploadException ex) {
			uploadHelper.logError(ex.getUuid(), ex.getMessage(), ex);
			uploadService.sendErrorAndCloseSession(concurrentSession, ex.getUuid(), ex.getMessage(), UploadErrorCode.SERVER_ERROR);
		}
	}
}
