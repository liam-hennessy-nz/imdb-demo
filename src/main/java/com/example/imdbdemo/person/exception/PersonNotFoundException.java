package com.example.imdbdemo.person.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class PersonNotFoundException extends ResourceNotFoundException {

	public PersonNotFoundException(String field, String value) {
		super("Person", field, value);
	}
}
