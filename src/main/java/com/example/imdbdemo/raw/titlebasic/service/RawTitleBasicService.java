package com.example.imdbdemo.raw.titlebasic.service;

import com.example.imdbdemo.raw.titlebasic.dto.RawTitleBasicDTO;
import com.example.imdbdemo.raw.titlebasic.entity.QRawTitleBasic;
import com.example.imdbdemo.raw.titlebasic.entity.RawTitleBasic;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.raw.titlebasic.exception.RawTitleBasicNotFoundException;
import com.example.imdbdemo.raw.titlebasic.mapper.RawTitleBasicMapper;
import com.example.imdbdemo.raw.titlebasic.repository.RawTitleBasicRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.example.imdbdemo.shared.PageHelper.*;

@Service
@RequiredArgsConstructor
public class RawTitleBasicService {
	private final JPAQueryFactory queryFactory;
	private final RawTitleBasicRepository rawTitleBasicRepository;
	private final RawTitleBasicMapper rawTitleBasicMapper;

	private static final QRawTitleBasic TITLE_BASIC = QRawTitleBasic.rawTitleBasic;

	private static Predicate toPredicate(Map<String, String> params) {
		List<ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, TITLE_BASIC.id, operator, value, Long::parseLong);
				case "tconst" -> applyStringOperator(booleanBuilder, TITLE_BASIC.tconst, operator, value);
				case "titleType" -> applyStringOperator(booleanBuilder, TITLE_BASIC.titleType, operator, value);
				case "primaryTitle" -> applyStringOperator(booleanBuilder, TITLE_BASIC.primaryTitle, operator, value);
				case "originalTitle" -> applyStringOperator(booleanBuilder, TITLE_BASIC.originalTitle, operator, value);
				case "isAdult" -> applyStringOperator(booleanBuilder, TITLE_BASIC.isAdult, operator, value);
				case "startYear" -> applyStringOperator(booleanBuilder, TITLE_BASIC.startYear, operator, value);
				case "endYear" -> applyStringOperator(booleanBuilder, TITLE_BASIC.endYear, operator, value);
				case "runtimeMinutes" -> applyStringOperator(booleanBuilder, TITLE_BASIC.runtimeMinutes, operator, value);
				case "genres" -> applyStringOperator(booleanBuilder, TITLE_BASIC.genres, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<RawTitleBasicDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawTitleBasicDTO> results = queryFactory
			.select(Projections.constructor(
				RawTitleBasicDTO.class,
				TITLE_BASIC.id,
				TITLE_BASIC.tconst,
				TITLE_BASIC.titleType,
				TITLE_BASIC.primaryTitle,
				TITLE_BASIC.originalTitle,
				TITLE_BASIC.isAdult,
				TITLE_BASIC.startYear,
				TITLE_BASIC.endYear,
				TITLE_BASIC.runtimeMinutes,
				TITLE_BASIC.genres
			))
			.from(TITLE_BASIC)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(TITLE_BASIC.count())
			.from(TITLE_BASIC)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<RawTitleBasicDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable,TITLE_BASIC);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawTitleBasicDTO findById(Long id) {
		Optional<RawTitleBasic> rawTitleBasic = rawTitleBasicRepository.findById(id);
		return rawTitleBasic.map(rawTitleBasicMapper::mapToDto)
			.orElseThrow(() -> new RawTitleBasicNotFoundException("id = %s".formatted(id)));
	}

	public RawTitleBasicDTO findByTconst(String tconst) {
		Optional<RawTitleBasic> rawTitleBasic = rawTitleBasicRepository.findByTconst(tconst);
		return rawTitleBasic.map(rawTitleBasicMapper::mapToDto)
			.orElseThrow(() -> new RawTitleBasicNotFoundException("tconst = %s".formatted(tconst)));
	}
}
