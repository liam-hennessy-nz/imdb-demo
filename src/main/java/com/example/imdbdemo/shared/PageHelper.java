package com.example.imdbdemo.shared;

import com.example.imdbdemo.shared.exception.IllegalFilterOperatorException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PageHelper {
	private static final Set<String> NON_FILTER_PARAMS = Set.of("page", "size", "sort");
	private static final String DEFAULT_FILTER_OPERATOR = "eq";
	private static final Pattern FILTER_PATTERN = Pattern.compile("(.+)\\[(.+)]");

	private static boolean isFilterParameter(String parameterName) {
		return !NON_FILTER_PARAMS.contains(parameterName);
	}

	private static ParsedFilter parseFilter(String key, String value) {
		Matcher matcher = FILTER_PATTERN.matcher(key);

		if (matcher.matches()) return new ParsedFilter(matcher.group(1), matcher.group(2), value);
		return new ParsedFilter(key, DEFAULT_FILTER_OPERATOR, value);
	}

	public static List<ParsedFilter> parseFilters(Map<String, String> params) {
		return params.entrySet().stream()
			.filter((entry) -> isFilterParameter(entry.getKey()))
			.map((entry) -> parseFilter(entry.getKey(), entry.getValue()))
			.toList();
	}

	public static void applyStringOperator(
		BooleanBuilder booleanBuilder, StringPath path, String operator, String value
	) {
		switch (operator) {
			case "contains" -> booleanBuilder.and(path.containsIgnoreCase(value));
			case "doesNotContain" -> booleanBuilder.and(path.containsIgnoreCase(value).not());
			case "equals" -> booleanBuilder.and(path.equalsIgnoreCase(value));
			case "doesNotEqual" -> booleanBuilder.and(path.notEqualsIgnoreCase(value));
			case "startsWith" -> booleanBuilder.and(path.startsWithIgnoreCase(value));
			case "endsWith" -> booleanBuilder.and(path.endsWithIgnoreCase(value));
			case "isEmpty" -> booleanBuilder.and(path.isEmpty());
			case "isNotEmpty" -> booleanBuilder.and(path.isNotEmpty());
			case "isAnyOf" -> booleanBuilder.and(path.in(value.split(",")));
			default -> throw new IllegalFilterOperatorException(operator);
		}
	}

	public static <T extends Number & Comparable<?>> void applyNumberOperator(
		BooleanBuilder booleanBuilder, NumberPath<T> path, String operator, String value, Function<String, T> parser
	) {
		T parsedNumber = parser.apply(value);

		switch (operator) {
			case "=" -> booleanBuilder.and(path.eq(parsedNumber));
			case "!=" -> booleanBuilder.and(path.ne(parsedNumber));
			case ">" -> booleanBuilder.and(path.gt(parsedNumber));
			case ">=" -> booleanBuilder.and(path.goe(parsedNumber));
			case "<" -> booleanBuilder.and(path.lt(parsedNumber));
			case "<=" -> booleanBuilder.and(path.loe(parsedNumber));
			default -> throw new IllegalFilterOperatorException(operator);
		}
	}

	public static void applyDateOperator(
		BooleanBuilder booleanBuilder, DatePath<LocalDate> path, String operator, String value
	) {
		LocalDate parsedDate = LocalDate.parse(value);

		switch (operator) {
			case "is" -> booleanBuilder.and(path.eq(parsedDate));
			case "not" -> booleanBuilder.and(path.ne(parsedDate));
			case "after" -> booleanBuilder.and(path.gt(parsedDate));
			case "onOrAfter" -> booleanBuilder.and(path.goe(parsedDate));
			case "before" -> booleanBuilder.and(path.lt(parsedDate));
			case "onOrBefore" -> booleanBuilder.and(path.loe(parsedDate));
			default -> throw new IllegalFilterOperatorException(operator);
		}
	}

	public static OrderSpecifier<?>[] toOrderSpecifiers(Pageable pageable, EntityPathBase<?> root) {
		PathBuilder<?> pathBuilder = new PathBuilder<>(root.getType(), root.getMetadata().getName());

		return pageable.getSort().stream()
			.map((order) -> new OrderSpecifier<>(
				order.isAscending() ? Order.ASC : Order.DESC,
				pathBuilder.getComparable(order.getProperty(), Comparable.class)))
			.toArray(OrderSpecifier[]::new);
	}

	public record ParsedFilter(String field, String operator, String value) {
	}
}
