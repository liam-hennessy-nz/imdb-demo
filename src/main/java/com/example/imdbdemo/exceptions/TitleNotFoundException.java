package com.example.imdbdemo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TitleNotFoundException extends RuntimeException {

	public TitleNotFoundException(String message) {
		super(message);
	}
}
