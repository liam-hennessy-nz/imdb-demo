package com.example.imdbdemo.raw.namebasic.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class RawNameBasicNotFoundException extends ResourceNotFoundException {

	public RawNameBasicNotFoundException(String field, String value) {
		super("RawNameBasic", field, value);
	}
}
