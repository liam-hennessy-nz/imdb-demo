package com.example.imdbdemo.shared.exception;

public class ResourceNotFoundException extends RuntimeException {

	public ResourceNotFoundException(String entity, String field, String value) {
		super("%s with [%s=%s] was not found".formatted(entity, field, value));
	}
}
