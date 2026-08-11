package com.example.imdbdemo.genre.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class GenreNotFoundException extends ResourceNotFoundException {

	public GenreNotFoundException(String field, String value) {
		super("Genre", field, value);
	}
}
