package com.example.imdbdemo.websocket.upload.exception;

import java.util.UUID;

public class UploadNotFoundException extends UploadException {

	public UploadNotFoundException(UUID uuid, String message) {
		super(uuid, message);
	}

	public UploadNotFoundException(UUID uuid, String message, Throwable cause) {
		super(uuid, message, cause);
	}
}
