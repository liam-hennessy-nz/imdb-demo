package com.example.imdbdemo.raw.titleepisode.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RawTitleEpisodeNotFoundException extends RuntimeException {
	public RawTitleEpisodeNotFoundException(String message) {
		super("RawTitleEpisode not found: %s".formatted(message));
	}
}
