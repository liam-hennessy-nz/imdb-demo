package com.example.imdbdemo.title.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.TITLE;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class TitleHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder bb = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String op = filter.operator();
			String val = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(bb, TITLE.id, op, val, Long::parseLong);
				case "tconst" -> applyStringOperator(bb, TITLE.tconst, op, val);
				case "isAdult" -> applyBooleanOperator(bb, TITLE.isAdult, val);
				case "startYear" -> applyNumberOperator(bb, TITLE.startYear, op, val, Short::parseShort);
				case "endYear" -> applyNumberOperator(bb, TITLE.endYear, op, val, Short::parseShort);
				case "runtimeMinutes" -> applyNumberOperator(bb, TITLE.runtimeMinutes, op, val, Integer::parseInt);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return bb.getValue();
	}
}
