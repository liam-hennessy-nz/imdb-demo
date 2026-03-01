package com.example.imdbdemo.websocket.upload;

import lombok.Getter;

@Getter
public class UploadErrorCode {
	public static final int BAD_REQUEST = 400;
	public static final int NOT_FOUND = 404;
	public static final int SERVER_ERROR = 500;
}
