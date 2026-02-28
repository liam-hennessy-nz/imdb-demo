package com.example.imdbdemo.websocket.upload.exception;

import java.util.UUID;

public class UploadUnsupportedException extends UploadException {

	public UploadUnsupportedException(UUID uuid, String message) {
		super(uuid, message);
	}

	public UploadUnsupportedException(UUID uuid, String message, Throwable cause) {
		super(uuid, message, cause);
	}
}
