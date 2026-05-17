package com.example.imdbdemo.raw.namebasic.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawNameBasicNotFoundException extends RuntimeException {

	public RawNameBasicNotFoundException(String message) {
		super("RawNameBasic not found: %s".formatted(message));
	}
}
