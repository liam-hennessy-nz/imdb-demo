package com.example.imdbdemo.raw.titleprincipal.exception;

import com.example.imdbdemo.shared.exception.ResourceNotFoundException;

public class RawTitlePrincipalNotFoundException extends ResourceNotFoundException {

	public RawTitlePrincipalNotFoundException(String field, String value) {
		super("RawTitlePrincipal", field, value);
	}
}
