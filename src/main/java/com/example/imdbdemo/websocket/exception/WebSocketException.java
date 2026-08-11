package com.example.imdbdemo.websocket.exception;

import java.util.UUID;
import lombok.Getter;

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
