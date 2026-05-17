package com.example.imdbdemo.raw.titlerating.service;

import com.example.imdbdemo.raw.titlerating.dto.RawTitleRatingDTO;
import com.example.imdbdemo.raw.titlerating.entity.QRawTitleRating;
import com.example.imdbdemo.raw.titlerating.entity.RawTitleRating;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.raw.titlerating.exception.RawTitleRatingNotFoundException;
import com.example.imdbdemo.raw.titlerating.mapper.RawTitleRatingMapper;
import com.example.imdbdemo.raw.titlerating.repository.RawTitleRatingRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.NonNull;
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
public class RawTitleRatingService {
	private final JPAQueryFactory queryFactory;
	private final RawTitleRatingRepository rawTitleRatingRepository;
	private final RawTitleRatingMapper rawTitleRatingMapper;

	private static final QRawTitleRating TITLE_RATING = QRawTitleRating.rawTitleRating;

	private static Predicate toPredicate(Map<String, String> params) {
		List<ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, TITLE_RATING.id, operator, value, Long::parseLong);
				case "tconst" -> applyStringOperator(booleanBuilder, TITLE_RATING.tconst, operator, value);
				case "averageRating" -> applyStringOperator(booleanBuilder, TITLE_RATING.averageRating, operator, value);
				case "numVotes" -> applyStringOperator(booleanBuilder, TITLE_RATING.numVotes, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<@NonNull RawTitleRatingDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawTitleRatingDTO> results = queryFactory
			.select(Projections.constructor(
				RawTitleRatingDTO.class,
				TITLE_RATING.id,
				TITLE_RATING.tconst,
				TITLE_RATING.averageRating,
				TITLE_RATING.numVotes
			))
			.from(TITLE_RATING)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(TITLE_RATING.count())
			.from(TITLE_RATING)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<@NonNull RawTitleRatingDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, TITLE_RATING);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawTitleRatingDTO findById(Long id) {
		Optional<RawTitleRating> rawTitleRating = rawTitleRatingRepository.findById(id);
		return rawTitleRating.map(rawTitleRatingMapper::toDto)
			.orElseThrow(() -> new RawTitleRatingNotFoundException("id = %s".formatted(id)));
	}

	public RawTitleRatingDTO findByTconst(String tconst) {
		Optional<RawTitleRating> rawTitleRating = rawTitleRatingRepository.findByTconst(tconst);
		return rawTitleRating.map(rawTitleRatingMapper::toDto)
			.orElseThrow(() -> new RawTitleRatingNotFoundException("tconst = %s".formatted(tconst)));
	}
}
