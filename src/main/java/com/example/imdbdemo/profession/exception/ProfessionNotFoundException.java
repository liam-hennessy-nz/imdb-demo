package com.example.imdbdemo.profession.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class ProfessionNotFoundException extends ResourceNotFoundException {

	public ProfessionNotFoundException(String field, String value) {
		super("Profession", field, value);
	}
}
