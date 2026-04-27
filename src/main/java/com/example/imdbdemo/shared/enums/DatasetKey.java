package com.example.imdbdemo.shared.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Getter
public enum DatasetKey {
	RAW_NAME_BASIC("rawNameBasic"),
	RAW_TITLE_AKA("rawTitleAka"),
	RAW_TITLE_BASIC("rawTitleBasic"),
	RAW_TITLE_CREW("rawTitleCrew"),
	RAW_TITLE_EPISODE("rawTitleEpisode"),
	RAW_TITLE_PRINCIPAL("rawTitlePrincipal"),
	RAW_TITLE_RATING("rawTitleRating");

	private final String value;

	DatasetKey(String value) {
		this.value = value;
	}

	private static final Map<String, DatasetKey> BY_VALUE =
		Arrays.stream(DatasetKey.values())
			.collect(Collectors.toMap(k -> k.value, Function.identity()));

	public static Optional<DatasetKey> fromValue(String value) {
		return Optional.ofNullable(BY_VALUE.get(value));
	}
}
