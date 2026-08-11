package com.example.imdbdemo.shared.constant;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TableEnum {
	PERSON("person"),
	PERSON_KNOWN_FOR_PROFESSION("person_known_for_profession"),
	PERSON_KNOWN_FOR_TITLE("person_known_for_title"),
	ALIAS("alias"),
	REGION("region"),
	LANGUAGE("language"),
	ALIAS_TYPE("alias_type"),
	TITLE("title"),
	TITLE_TYPE("title_type"),
	GENRE("genre"),
	EPISODE("episode"),
	PRINCIPAL("principal"),
	PROFESSION("profession"),
	CHARACTER("character"),
	RATING("rating");

	private final String value;

	private static final Map<String, TableEnum> FROM_VALUE = Arrays.stream(TableEnum.values()).collect(
		Collectors.toMap(TableEnum::getValue, Function.identity())
	);

	public static Optional<TableEnum> getByValue(String value) {
		return Optional.ofNullable(FROM_VALUE.get(value));
	}
}
