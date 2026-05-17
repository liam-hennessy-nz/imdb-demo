package com.example.imdbdemo.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class IllegalFilterFieldException extends RuntimeException {
	private final String field;

	public IllegalFilterFieldException(String field) {
		super("Invalid filter: field='%s'".formatted(field));
		this.field = field;
	}
}
