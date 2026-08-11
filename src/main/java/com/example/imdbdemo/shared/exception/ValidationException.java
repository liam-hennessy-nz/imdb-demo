package com.example.imdbdemo.shared.exception;

import jakarta.validation.ConstraintViolation;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {

	private final Map<String, String> violations;

	public ValidationException(Set<? extends ConstraintViolation<?>> violations) {
		super(buildMessage(violations));

		this.violations = violations
			.stream()
			.collect(Collectors.toMap((v) -> v.getPropertyPath().toString(), ConstraintViolation::getMessage));
	}

	private static String buildMessage(Set<? extends ConstraintViolation<?>> violations) {
		return violations
			.stream()
			.map((v) -> "%s: %s".formatted(v.getPropertyPath(), v.getMessage()))
			.collect(Collectors.joining(", "));
	}
}
