package com.example.imdbdemo.raw.titleaka.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class RawTitleAkaNotFoundException extends ResourceNotFoundException {

	public RawTitleAkaNotFoundException(String field, String value) {
		super("RawTitleAka", field, value);
	}
}
