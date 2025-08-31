package com.example.imdbdemo.config;

import com.example.imdbdemo.config.props.AppProps;
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

	public WebSocketConfig(
		UploadWebSocketHandler uploadWebSocketHandler,
		SessionWebSocketHandler sessionWebSocketHandler
	) {
		this.uploadWebSocketHandler = uploadWebSocketHandler;
		this.sessionWebSocketHandler = sessionWebSocketHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
			.addHandler(uploadWebSocketHandler, "/ws/session")
			.setAllowedOrigins("*");
	}

	@Bean
	public ServletServerContainerFactoryBean createWebSocketContainer(AppProps props) {
		ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
		// Set max bytes to chunkSize + int size for chunkIndex
		container.setMaxBinaryMessageBufferSize(props.ws().chunkSize() + Integer.BYTES);
		container.setMaxTextMessageBufferSize(props.ws().chunkSize() + Integer.BYTES);
		return container;
	}
}
