package com.example.imdbdemo.raw.titlecrew.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawTitleCrewNotFoundException extends RuntimeException {
	public RawTitleCrewNotFoundException(String message) {
		super("RawTitleCrew not found: %s".formatted(message));
	}
}
