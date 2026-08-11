package com.example.imdbdemo.character.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class CharacterNotFoundException extends ResourceNotFoundException {

	public CharacterNotFoundException(String field, String value) {
		super("Character", field, value);
	}
}
