package com.example.imdbdemo.config;

import com.example.imdbdemo.constants.AppConstants;
import com.example.imdbdemo.websockets.SessionWebSocketHandler;
import com.example.imdbdemo.websockets.upload.UploadWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

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

	@Bean
	public ServletServerContainerFactoryBean createWebSocketContainer(AppConstants appConstants) {
		ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
		container.setMaxBinaryMessageBufferSize(appConstants.getWebSocketChunkSize());
		container.setMaxTextMessageBufferSize(appConstants.getWebSocketChunkSize());
		return container;
	}
}
