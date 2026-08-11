package com.example.imdbdemo.raw.namebasic.service;

import static com.example.imdbdemo.shared.PageHelper.applyStringOperator;
import static com.example.imdbdemo.shared.PageHelper.parseFilters;
import static com.example.imdbdemo.shared.constant.Constants.RAW_NAME_BASIC;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class RawNameBasicHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "nconst" -> applyStringOperator(booleanBuilder, RAW_NAME_BASIC.nconst, operator, value);
				case "primaryName" -> applyStringOperator(booleanBuilder, RAW_NAME_BASIC.primaryName, operator, value);
				case "birthYear" -> applyStringOperator(booleanBuilder, RAW_NAME_BASIC.birthYear, operator, value);
				case "deathYear" -> applyStringOperator(booleanBuilder, RAW_NAME_BASIC.deathYear, operator, value);
				case "primaryProfession" -> applyStringOperator(
					booleanBuilder,
					RAW_NAME_BASIC.primaryProfession,
					operator,
					value
				);
				case "knownForTitles" -> applyStringOperator(booleanBuilder, RAW_NAME_BASIC.knownForTitles, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}
}
