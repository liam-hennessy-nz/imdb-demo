package com.example.imdbdemo.raw.titlebasic.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class RawTitleBasicNotFoundException extends ResourceNotFoundException {

	public RawTitleBasicNotFoundException(String field, String value) {
		super("RawTitleBasic", field, value);
	}
}
