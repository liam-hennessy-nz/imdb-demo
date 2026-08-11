package com.example.imdbdemo.alias.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class AliasNotFoundException extends ResourceNotFoundException {

	public AliasNotFoundException(String field, String value) {
		super("Alias", field, value);
	}
}
