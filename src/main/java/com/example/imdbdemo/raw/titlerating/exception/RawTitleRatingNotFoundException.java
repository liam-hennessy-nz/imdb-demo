package com.example.imdbdemo.raw.titlerating.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawTitleRatingNotFoundException extends RuntimeException {
	public RawTitleRatingNotFoundException(String message) {
		super("RawTitleRating not found: %s".formatted(message));
	}
}
