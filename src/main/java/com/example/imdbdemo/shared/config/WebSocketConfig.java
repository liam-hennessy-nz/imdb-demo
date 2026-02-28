package com.example.imdbdemo.shared.config;

import com.example.imdbdemo.shared.config.props.AppProps;
import com.example.imdbdemo.websocket.upload.UploadHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	private final UploadHandler uploadHandler;

	public WebSocketConfig(
		UploadHandler uploadHandler
	) {
		this.uploadHandler = uploadHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
			.addHandler(uploadHandler, "/ws/upload")
			.setAllowedOrigins("*");
	}

	@Bean
	public ServletServerContainerFactoryBean createWebSocketContainer(AppProps appProps) {
		ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
		// Set max bytes to chunkByteSize + 1KB for a bit of extra room
		int bufferSize = appProps.ws().chunk().byteSize() + Byte.SIZE * 1024;
		container.setMaxBinaryMessageBufferSize(bufferSize);
		container.setMaxTextMessageBufferSize(bufferSize);
		return container;
	}
}
