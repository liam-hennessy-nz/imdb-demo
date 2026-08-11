package com.example.imdbdemo.profession.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.PROFESSION;

import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class ProfessionHelper {

	public static Predicate toPredicate(MultiValueMap<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder bb = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String op = filter.operator();
			String val = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(bb, PROFESSION.id, op, val, Long::parseLong);
				case "name" -> applyStringOperator(bb, PROFESSION.name, op, val);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return bb.getValue();
	}
}
