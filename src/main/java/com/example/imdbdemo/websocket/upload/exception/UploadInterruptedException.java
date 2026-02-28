package com.example.imdbdemo.websocket.upload.exception;

import java.util.UUID;

public class UploadInterruptedException extends UploadException {

	public UploadInterruptedException(UUID uuid, String message) {
		super(uuid, message);
	}

	public UploadInterruptedException(UUID uuid, String message, Throwable cause) {
		super(uuid, message, cause);
	}
}
