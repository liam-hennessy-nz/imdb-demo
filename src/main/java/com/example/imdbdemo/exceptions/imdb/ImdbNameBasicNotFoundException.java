package com.example.imdbdemo.exceptions.imdb;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ImdbNameBasicNotFoundException extends RuntimeException {

	public ImdbNameBasicNotFoundException(String message) {
		super("ImdbNameBasic not found: %s".formatted(message));
	}
}
