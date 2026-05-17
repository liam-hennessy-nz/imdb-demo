package com.example.imdbdemo.raw.titleprincipal.service;

import com.example.imdbdemo.raw.titleprincipal.entity.QRawTitlePrincipal;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.raw.titleprincipal.dto.RawTitlePrincipalDTO;
import com.example.imdbdemo.raw.titleprincipal.entity.RawTitlePrincipal;
import com.example.imdbdemo.raw.titleprincipal.exception.RawTitlePrincipalNotFoundException;
import com.example.imdbdemo.raw.titleprincipal.mapper.RawTitlePrincipalMapper;
import com.example.imdbdemo.raw.titleprincipal.repository.RawTitlePrincipalRepository;
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
public class RawTitlePrincipalService {
	private final JPAQueryFactory queryFactory;
	private final RawTitlePrincipalRepository rawTitlePrincipalRepository;
	private final RawTitlePrincipalMapper rawTitlePrincipalMapper;

	private static final QRawTitlePrincipal TITLE_PRINCIPAL = QRawTitlePrincipal.rawTitlePrincipal;

	private static Predicate toPredicate(Map<String, String> params) {
		List<ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, TITLE_PRINCIPAL.id, operator, value, Long::parseLong);
				case "tconst" -> applyStringOperator(booleanBuilder, TITLE_PRINCIPAL.tconst, operator, value);
				case "ordering" -> applyStringOperator(booleanBuilder, TITLE_PRINCIPAL.ordering, operator, value);
				case "nconst" -> applyStringOperator(booleanBuilder, TITLE_PRINCIPAL.nconst, operator, value);
				case "category" -> applyStringOperator(booleanBuilder, TITLE_PRINCIPAL.category, operator, value);
				case "job" -> applyStringOperator(booleanBuilder, TITLE_PRINCIPAL.job, operator, value);
				case "characters" -> applyStringOperator(booleanBuilder, TITLE_PRINCIPAL.characters, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<RawTitlePrincipalDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawTitlePrincipalDTO> results = queryFactory
			.select(Projections.constructor(
				RawTitlePrincipalDTO.class,
				TITLE_PRINCIPAL.id,
				TITLE_PRINCIPAL.tconst,
				TITLE_PRINCIPAL.ordering,
				TITLE_PRINCIPAL.nconst,
				TITLE_PRINCIPAL.category,
				TITLE_PRINCIPAL.job,
				TITLE_PRINCIPAL.characters
			))
			.from(TITLE_PRINCIPAL)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(TITLE_PRINCIPAL.count())
			.from(TITLE_PRINCIPAL)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<RawTitlePrincipalDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		 OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, TITLE_PRINCIPAL);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawTitlePrincipalDTO findById(Long id) {
		Optional<RawTitlePrincipal> rawTitlePrincipal = rawTitlePrincipalRepository.findById(id);
		return rawTitlePrincipal.map(rawTitlePrincipalMapper::mapToDto)
			.orElseThrow(() -> new RawTitlePrincipalNotFoundException("id = %s".formatted(id)));
	}

	public RawTitlePrincipalDTO findByTconst(String tconst) {
		Optional<RawTitlePrincipal> rawTitlePrincipal = rawTitlePrincipalRepository.findByTconst(tconst);
		return rawTitlePrincipal.map(rawTitlePrincipalMapper::mapToDto)
			.orElseThrow(() -> new RawTitlePrincipalNotFoundException("tconst = %s".formatted(tconst)));
	}
}
