package com.example.imdbdemo.raw.titleaka.service;

import com.example.imdbdemo.raw.titleaka.dto.RawTitleAkaDTO;
import com.example.imdbdemo.raw.titleaka.entity.QRawTitleAka;
import com.example.imdbdemo.raw.titleaka.entity.RawTitleAka;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.shared.PageHelper;
import com.example.imdbdemo.raw.titleaka.exception.RawTitleAkaNotFoundException;
import com.example.imdbdemo.raw.titleaka.mapper.RawTitleAkaMapper;
import com.example.imdbdemo.raw.titleaka.repository.RawTitleAkaRepository;
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
public class RawTitleAkaService {
	private final JPAQueryFactory queryFactory;
	private final RawTitleAkaRepository rawTitleAkaRepository;
	private final RawTitleAkaMapper rawTitleAkaMapper;

	private static final QRawTitleAka TITLE_AKA = QRawTitleAka.rawTitleAka;

	private static Predicate toPredicate(Map<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, TITLE_AKA.id, operator, value, Long::parseLong);
				case "tconst" -> applyStringOperator(booleanBuilder, TITLE_AKA.tconst, operator, value);
				case "ordering" -> applyStringOperator(booleanBuilder, TITLE_AKA.ordering, operator, value);
				case "title" -> applyStringOperator(booleanBuilder, TITLE_AKA.title, operator, value);
				case "region" -> applyStringOperator(booleanBuilder, TITLE_AKA.region, operator, value);
				case "language" -> applyStringOperator(booleanBuilder, TITLE_AKA.language, operator, value);
				case "types" -> applyStringOperator(booleanBuilder, TITLE_AKA.types, operator, value);
				case "attributes" -> applyStringOperator(booleanBuilder, TITLE_AKA.attributes, operator, value);
				case "isOriginalTitle" -> applyStringOperator(booleanBuilder, TITLE_AKA.isOriginalTitle, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<RawTitleAkaDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawTitleAkaDTO> results = queryFactory
			.select(Projections.constructor(
				RawTitleAkaDTO.class,
				TITLE_AKA.id,
				TITLE_AKA.tconst,
				TITLE_AKA.ordering,
				TITLE_AKA.title,
				TITLE_AKA.region,
				TITLE_AKA.language,
				TITLE_AKA.types,
				TITLE_AKA.attributes,
				TITLE_AKA.isOriginalTitle
			))
			.from(TITLE_AKA)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(TITLE_AKA.count())
			.from(TITLE_AKA)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<RawTitleAkaDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, QRawTitleAka.rawTitleAka);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawTitleAkaDTO findById(Long id) {
		Optional<RawTitleAka> rawTitleAka = rawTitleAkaRepository.findById(id);
		return rawTitleAka.map(rawTitleAkaMapper::mapToDto)
			.orElseThrow(() -> new RawTitleAkaNotFoundException("id = %s".formatted(id)));
	}

	public RawTitleAkaDTO findByTconst(String tconst) {
		Optional<RawTitleAka> rawTitleAka = rawTitleAkaRepository.findByTconst(tconst);
		return rawTitleAka.map(rawTitleAkaMapper::mapToDto)
			.orElseThrow(() -> new RawTitleAkaNotFoundException("tconst = %s".formatted(tconst)));
	}
}
