package com.example.imdbdemo.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class IllegalFilterOperatorException extends RuntimeException {
	private final String operator;

	public IllegalFilterOperatorException(String operator) {
		super("Invalid filter: operator='%s'".formatted(operator));
		this.operator = operator;
	}
}
