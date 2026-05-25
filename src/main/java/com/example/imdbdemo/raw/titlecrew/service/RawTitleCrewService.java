package com.example.imdbdemo.raw.titlecrew.service;

import com.example.imdbdemo.raw.titlecrew.entity.QRawTitleCrew;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.raw.titlecrew.dto.RawTitleCrewDTO;
import com.example.imdbdemo.raw.titlecrew.entity.RawTitleCrew;
import com.example.imdbdemo.raw.titlecrew.exception.RawTitleCrewNotFoundException;
import com.example.imdbdemo.raw.titlecrew.mapper.RawTitleCrewMapper;
import com.example.imdbdemo.raw.titlecrew.repository.RawTitleCrewRespository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.Predicate;
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
public class RawTitleCrewService {
	private final JPAQueryFactory queryFactory;
	private final RawTitleCrewRespository rawTitleCrewRespository;
	private final RawTitleCrewMapper rawTitleCrewMapper;

	private static final QRawTitleCrew TITLE_CREW = QRawTitleCrew.rawTitleCrew;

	private static Predicate toPredicate(Map<String, String> params) {
		List<ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, TITLE_CREW.id, operator, value, Long::parseLong);
				case "tconst" -> applyStringOperator(booleanBuilder, TITLE_CREW.tconst, operator, value);
				case "directors" -> applyStringOperator(booleanBuilder, TITLE_CREW.directors, operator, value);
				case "writers" -> applyStringOperator(booleanBuilder, TITLE_CREW.writers, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<RawTitleCrewDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawTitleCrewDTO> results = queryFactory
			.select(Projections.constructor(
				RawTitleCrewDTO.class,
				TITLE_CREW.id,
				TITLE_CREW.tconst,
				TITLE_CREW.directors,
				TITLE_CREW.writers
			))
			.from(TITLE_CREW)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(TITLE_CREW.count())
			.from(TITLE_CREW)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<RawTitleCrewDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, TITLE_CREW);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawTitleCrewDTO findById(Long id) {
		Optional<RawTitleCrew> rawTitleCrew = rawTitleCrewRespository.findById(id);
		return rawTitleCrew.map(rawTitleCrewMapper::mapToDto)
			.orElseThrow(() -> new RawTitleCrewNotFoundException("id = %s".formatted(id)));
	}

	public RawTitleCrewDTO findByTconst(String tconst) {
		Optional<RawTitleCrew> rawTitleCrew = rawTitleCrewRespository.findByTconst(tconst);
		return rawTitleCrew.map(rawTitleCrewMapper::mapToDto)
			.orElseThrow(() -> new RawTitleCrewNotFoundException("tconst = %s".formatted(tconst)));
	}
}
