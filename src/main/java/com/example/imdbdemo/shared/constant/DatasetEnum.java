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
public enum DatasetEnum {
	RAW_NAME_BASIC("rawNameBasic"),
	RAW_TITLE_AKA("rawTitleAka"),
	RAW_TITLE_BASIC("rawTitleBasic"),
	RAW_TITLE_EPISODE("rawTitleEpisode"),
	RAW_TITLE_PRINCIPAL("rawTitlePrincipal"),
	RAW_TITLE_RATING("rawTitleRating");

	private final String value;

	private static final Map<String, DatasetEnum> FROM_VALUE = Arrays.stream(DatasetEnum.values()).collect(
		Collectors.toMap(DatasetEnum::getValue, Function.identity())
	);

	public static Optional<DatasetEnum> getByValue(String value) {
		return Optional.ofNullable(FROM_VALUE.get(value));
	}

	public static boolean contains(String value) {
		return FROM_VALUE.containsKey(value);
	}
}
