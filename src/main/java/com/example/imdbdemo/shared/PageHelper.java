package com.example.imdbdemo.shared;

import static com.example.imdbdemo.shared.constant.Constants.*;

import com.example.imdbdemo.shared.exception.IllegalFilterOperatorException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;

@Component
public class PageHelper {

	private static final Set<String> NON_FILTER_PARAMS = Set.of(PARAM_PAGE, PARAM_SIZE, PARAM_SORT, PARAM_INCLUDE);
	private static final Pattern FILTER_WITH_OPERATOR_PATTERN = Pattern.compile("(.+)\\[(.+)]");

	public record ParsedFilter(String field, String operator, String value) {}

	public static List<ParsedFilter> parseFilters(MultiValueMap<String, String> params) {
		return params
			.entrySet()
			.stream()
			.filter((entry) -> isFilterParameter(entry.getKey()))
			.map((entry) -> parseFilters(entry.getKey(), entry.getValue()))
			.flatMap(List::stream)
			.toList();
	}

	public static List<String> toIncludes(MultiValueMap<String, String> params) {
		List<String> includes = params.get(PARAM_INCLUDE);
		if (CollectionUtils.isEmpty(includes)) return List.of();

		return includes.stream().map(String::trim).filter(StringUtils::isNotBlank).toList();
	}

	public static OrderSpecifier<?>[] toOrderSpecifiers(Pageable pageable, EntityPathBase<?> root) {
		PathBuilder<?> pathBuilder = new PathBuilder<>(root.getType(), root.getMetadata().getName());

		return pageable
			.getSort()
			.stream()
			.map((order) ->
				new OrderSpecifier<>(
					order.isAscending() ? Order.ASC : Order.DESC,
					pathBuilder.getComparable(order.getProperty(), Comparable.class)
				)
			)
			.toArray(OrderSpecifier[]::new);
	}

	public static void applyStringOperator(
		BooleanBuilder booleanBuilder,
		StringPath path,
		String operator,
		String value
	) {
		switch (operator) {
			case OP_CONTAINS -> booleanBuilder.and(path.containsIgnoreCase(value));
			case OP_NOT_CONTAINS -> booleanBuilder.and(path.containsIgnoreCase(value).not());
			case OP_EQUALS -> booleanBuilder.and(path.equalsIgnoreCase(value));
			case OP_NOT_EQUALS -> booleanBuilder.and(path.notEqualsIgnoreCase(value));
			case OP_STARTS_WITH -> booleanBuilder.and(path.startsWithIgnoreCase(value));
			case OP_ENDS_WITH -> booleanBuilder.and(path.endsWithIgnoreCase(value));
			case OP_EMPTY -> booleanBuilder.and(path.isEmpty());
			case OP_NOT_EMPTY -> booleanBuilder.and(path.isNotEmpty());
			case OP_ANY_OF -> booleanBuilder.and(path.in(value.split(",")));
			default -> throw new IllegalFilterOperatorException(operator);
		}
	}

	public static void applyBooleanOperator(BooleanBuilder booleanBuilder, BooleanPath path, String operator) {
		booleanBuilder.and(path.eq(Boolean.parseBoolean(operator)));
	}

	public static <T extends Number & Comparable<?>> void applyNumberOperator(
		BooleanBuilder booleanBuilder,
		NumberPath<T> path,
		String operator,
		String value,
		Function<String, T> parser
	) {
		switch (operator) {
			case OP_EQ -> booleanBuilder.and(path.eq(parser.apply(value)));
			case OP_NE -> booleanBuilder.and(path.ne(parser.apply(value)));
			case OP_GT -> booleanBuilder.and(path.gt(parser.apply(value)));
			case OP_GOE -> booleanBuilder.and(path.goe(parser.apply(value)));
			case OP_LT -> booleanBuilder.and(path.lt(parser.apply(value)));
			case OP_LOE -> booleanBuilder.and(path.loe(parser.apply(value)));
			case OP_EMPTY -> booleanBuilder.and(path.isNull());
			case OP_NOT_EMPTY -> booleanBuilder.and(path.isNotNull());
			case OP_ANY_OF -> booleanBuilder.and(path.in(Arrays.stream(value.split(",")).map(parser).toList()));
			default -> throw new IllegalFilterOperatorException(operator);
		}
	}

	public static void applyDateOperator(
		BooleanBuilder booleanBuilder,
		DatePath<LocalDate> path,
		String operator,
		String value
	) {
		LocalDate parsedDate = LocalDate.parse(value);

		switch (operator) {
			case OP_IS -> booleanBuilder.and(path.eq(parsedDate));
			case OP_IS_NOT -> booleanBuilder.and(path.ne(parsedDate));
			case OP_AFTER -> booleanBuilder.and(path.gt(parsedDate));
			case OP_ON_OR_AFTER -> booleanBuilder.and(path.goe(parsedDate));
			case OP_BEFORE -> booleanBuilder.and(path.lt(parsedDate));
			case OP_ON_OR_BEFORE -> booleanBuilder.and(path.loe(parsedDate));
			default -> throw new IllegalFilterOperatorException(operator);
		}
	}

	public static <T> List<T> selectAll(
		JPAQueryFactory queryFactory,
		EntityPath<T> entity,
		Predicate predicate,
		OrderSpecifier<?>[] orderSpecifiers,
		Pageable pageable
	) {
		return queryFactory
			.selectFrom(entity)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();
	}

	public static <T> long countAll(JPAQueryFactory queryFactory, EntityPath<T> entity, Predicate predicate) {
		Long count = queryFactory.select(Wildcard.count).from(entity).where(predicate).fetchOne();
		return count != null ? count : 0L;
	}

	private static boolean isFilterParameter(String parameterName) {
		return !NON_FILTER_PARAMS.contains(parameterName);
	}

	private static List<ParsedFilter> parseFilters(String key, List<String> values) {
		Matcher matcher = FILTER_WITH_OPERATOR_PATTERN.matcher(key);

		List<ParsedFilter> parsedFilters = new ArrayList<>();

		if (matcher.matches()) {
			String field = matcher.group(1);
			String operator = matcher.group(2);

			for (String value : values) {
				parsedFilters.add(new ParsedFilter(field, operator, value));
			}
			return parsedFilters;
		}

		for (String value : values) {
			parsedFilters.add(new ParsedFilter(key, OP_DEFAULT, value));
		}
		return parsedFilters;
	}
}
