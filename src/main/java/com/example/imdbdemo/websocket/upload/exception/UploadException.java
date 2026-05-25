package com.example.imdbdemo.websocket.upload.exception;

import com.example.imdbdemo.websocket.WebSocketException;
import java.util.UUID;
import lombok.Getter;

@Getter
public class UploadException extends WebSocketException {

	public UploadException(UUID uuid, String message) {
		super(uuid, message);
	}

	public UploadException(UUID uuid, String message, Throwable cause) {
		super(uuid, message, cause);
	}
}
