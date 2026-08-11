package com.example.imdbdemo.raw.titleprincipal.service;

import static com.example.imdbdemo.shared.PageHelper.applyStringOperator;
import static com.example.imdbdemo.shared.PageHelper.parseFilters;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_PRINCIPAL;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class RawTitlePrincipalHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "tconst" -> applyStringOperator(booleanBuilder, RAW_TITLE_PRINCIPAL.tconst, operator, value);
				case "ordering" -> applyStringOperator(booleanBuilder, RAW_TITLE_PRINCIPAL.ordering, operator, value);
				case "nconst" -> applyStringOperator(booleanBuilder, RAW_TITLE_PRINCIPAL.nconst, operator, value);
				case "category" -> applyStringOperator(booleanBuilder, RAW_TITLE_PRINCIPAL.category, operator, value);
				case "job" -> applyStringOperator(booleanBuilder, RAW_TITLE_PRINCIPAL.job, operator, value);
				case "characters" -> applyStringOperator(booleanBuilder, RAW_TITLE_PRINCIPAL.characters, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}
}
