package com.example.imdbdemo.websockets;

import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Slf4j
@Component
public class UploadWebSocketHandler extends AbstractWebSocketHandler {

	@Override
	public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
		log.info("Upload WebSocket [{}] established", session.getId());
	}

	@Override
	public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
		log.info("Upload WebSocket [{}] closed: {}", session.getId(), status.getReason());
	}

	@Override
	protected void handleBinaryMessage(@NonNull WebSocketSession session, @NonNull BinaryMessage message) throws Exception {
		log.info("Upload WebSocket [{}] received binary message: {}", session.getId(), message.getPayload());

		InputStream inputStream = new ByteArrayInputStream(message.getPayload().array());
		
	}

	@Override
	protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
		log.info("Upload WebSocket [{}] received text message: {}", session.getId(), message.getPayload());

		String payload = message.getPayload();
		if (payload.contains("EOF")) {
			session.sendMessage(new TextMessage("Server received EOF, upload complete"));
			session.close();
		}
	}
}
