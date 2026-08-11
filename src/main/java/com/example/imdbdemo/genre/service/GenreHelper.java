package com.example.imdbdemo.genre.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.GENRE;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class GenreHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder bb = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String op = filter.operator();
			String val = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(bb, GENRE.id, op, val, Long::parseLong);
				case "name" -> applyStringOperator(bb, GENRE.name, op, val);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return bb.getValue();
	}
}
