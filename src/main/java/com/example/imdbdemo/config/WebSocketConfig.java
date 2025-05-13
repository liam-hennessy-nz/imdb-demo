package com.example.imdbdemo.config;

import com.example.imdbdemo.websockets.SessionWebSocketHandler;
import com.example.imdbdemo.websockets.UploadWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	private final UploadWebSocketHandler uploadWebSocketHandler;
	private final SessionWebSocketHandler sessionWebSocketHandler;

	public WebSocketConfig(UploadWebSocketHandler uploadWebSocketHandler, SessionWebSocketHandler sessionWebSocketHandler) {
		this.uploadWebSocketHandler = uploadWebSocketHandler;
		this.sessionWebSocketHandler = sessionWebSocketHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
			.addHandler(sessionWebSocketHandler, "/ws/session")
			.setAllowedOrigins("*")
			.addHandler(uploadWebSocketHandler, "/ws/upload")
			.setAllowedOrigins("*");
	}
}
