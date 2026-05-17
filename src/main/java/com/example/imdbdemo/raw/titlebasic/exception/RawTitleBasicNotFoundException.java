package com.example.imdbdemo.raw.titlebasic.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawTitleBasicNotFoundException extends RuntimeException {
	public RawTitleBasicNotFoundException(String message) {
		super("RawTitleBasic not found: %s".formatted(message));
	}
}
