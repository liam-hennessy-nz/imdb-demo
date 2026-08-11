package com.example.imdbdemo.raw.titleaka.service;

import static com.example.imdbdemo.shared.PageHelper.applyStringOperator;
import static com.example.imdbdemo.shared.PageHelper.parseFilters;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_AKA;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class RawTitleAkaHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "tconst" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.tconst, operator, value);
				case "ordering" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.ordering, operator, value);
				case "title" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.title, operator, value);
				case "region" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.region, operator, value);
				case "language" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.language, operator, value);
				case "types" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.types, operator, value);
				case "attributes" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.attributes, operator, value);
				case "isOriginalTitle" -> applyStringOperator(booleanBuilder, RAW_TITLE_AKA.isOriginalTitle, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}
}
