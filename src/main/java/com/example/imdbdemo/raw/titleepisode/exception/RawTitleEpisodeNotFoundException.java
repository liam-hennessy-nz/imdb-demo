package com.example.imdbdemo.raw.titleepisode.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class RawTitleEpisodeNotFoundException extends ResourceNotFoundException {

	public RawTitleEpisodeNotFoundException(String field, String value) {
		super("RawTitleEpisode", field, value);
	}
}
