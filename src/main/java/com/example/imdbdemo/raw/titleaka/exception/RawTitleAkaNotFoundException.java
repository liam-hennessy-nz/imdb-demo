package com.example.imdbdemo.raw.titleaka.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawTitleAkaNotFoundException extends RuntimeException {
	public RawTitleAkaNotFoundException(String message) {
		super("RawTitleAka not found: %s".formatted(message));
	}
}
