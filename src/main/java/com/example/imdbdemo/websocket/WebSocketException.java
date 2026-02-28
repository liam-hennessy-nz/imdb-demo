package com.example.imdbdemo.websocket;

import lombok.Getter;

import java.util.UUID;

@Getter
public class WebSocketException extends RuntimeException {
	private final UUID uuid;

	public WebSocketException(UUID uuid, String message) {
		super(message);
		this.uuid = uuid;
	}

	public WebSocketException(UUID uuid, String message, Throwable cause) {
		super(message, cause);
		this.uuid = uuid;
	}
}
