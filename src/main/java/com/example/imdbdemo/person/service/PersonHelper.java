package com.example.imdbdemo.person.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.PERSON;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class PersonHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder bb = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String op = filter.operator();
			String val = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(bb, PERSON.id, op, val, Long::parseLong);
				case "nconst" -> applyStringOperator(bb, PERSON.nconst, op, val);
				case "name" -> applyStringOperator(bb, PERSON.name, op, val);
				case "birthYear" -> applyNumberOperator(bb, PERSON.birthYear, op, val, Short::parseShort);
				case "deathYear" -> applyNumberOperator(bb, PERSON.deathYear, op, val, Short::parseShort);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return bb.getValue();
	}
}
