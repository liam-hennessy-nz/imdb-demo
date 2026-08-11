package com.example.imdbdemo.raw.titlebasic.service;

import static com.example.imdbdemo.shared.PageHelper.applyStringOperator;
import static com.example.imdbdemo.shared.PageHelper.parseFilters;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_BASIC;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class RawTitleBasicHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "tconst" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.tconst, operator, value);
				case "titleType" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.titleType, operator, value);
				case "primaryTitle" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.primaryTitle, operator, value);
				case "originalTitle" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.originalTitle, operator, value);
				case "isAdult" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.isAdult, operator, value);
				case "startYear" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.startYear, operator, value);
				case "endYear" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.endYear, operator, value);
				case "runtimeMinutes" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.runtimeMinutes, operator, value);
				case "genres" -> applyStringOperator(booleanBuilder, RAW_TITLE_BASIC.genres, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}
}
