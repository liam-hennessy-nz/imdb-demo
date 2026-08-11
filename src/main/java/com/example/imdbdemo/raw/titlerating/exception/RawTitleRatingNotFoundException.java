package com.example.imdbdemo.raw.titlerating.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class RawTitleRatingNotFoundException extends ResourceNotFoundException {

	public RawTitleRatingNotFoundException(String field, String value) {
		super("RawTitleRating", field, value);
	}
}
