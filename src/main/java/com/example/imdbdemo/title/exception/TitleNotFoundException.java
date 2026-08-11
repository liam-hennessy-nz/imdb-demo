package com.example.imdbdemo.title.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class TitleNotFoundException extends ResourceNotFoundException {

	public TitleNotFoundException(String field, String value) {
		super("Title", field, value);
	}
}
