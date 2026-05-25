package com.example.imdbdemo.raw.titleprincipal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawTitlePrincipalNotFoundException extends RuntimeException {
	public RawTitlePrincipalNotFoundException(String message) {
		super("RawTitlePrincipal not found: %s".formatted(message));
	}
}
