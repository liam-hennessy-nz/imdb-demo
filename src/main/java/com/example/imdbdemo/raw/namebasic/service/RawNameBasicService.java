package com.example.imdbdemo.raw.namebasic.service;

import com.example.imdbdemo.raw.namebasic.dto.RawNameBasicDTO;
import com.example.imdbdemo.raw.namebasic.entity.QRawNameBasic;
import com.example.imdbdemo.raw.namebasic.entity.RawNameBasic;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.raw.namebasic.exception.RawNameBasicNotFoundException;
import com.example.imdbdemo.raw.namebasic.mapper.RawNameBasicMapper;
import com.example.imdbdemo.raw.namebasic.repository.RawNameBasicRepository;
import com.example.imdbdemo.shared.PageHelper;
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
public class RawNameBasicService {
	private final JPAQueryFactory queryFactory;
	private final RawNameBasicRepository rawNameBasicRepository;
	private final RawNameBasicMapper rawNameBasicMapper;

	private static final QRawNameBasic NAME_BASIC = QRawNameBasic.rawNameBasic;

	private static Predicate toPredicate(Map<String, String> params) {
		List<PageHelper.ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (PageHelper.ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, NAME_BASIC.id, operator, value, Long::parseLong);
				case "nconst" -> applyStringOperator(booleanBuilder, NAME_BASIC.nconst, operator, value);
				case "primaryName" -> applyStringOperator(booleanBuilder, NAME_BASIC.primaryName, operator, value);
				case "birthYear" -> applyStringOperator(booleanBuilder, NAME_BASIC.birthYear, operator, value);
				case "deathYear" -> applyStringOperator(booleanBuilder, NAME_BASIC.deathYear, operator, value);
				case "primaryProfession" -> applyStringOperator(booleanBuilder, NAME_BASIC.primaryProfession, operator, value);
				case "knownForTitles" -> applyStringOperator(booleanBuilder, NAME_BASIC.knownForTitles, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<RawNameBasicDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawNameBasicDTO> results = queryFactory
			.select(Projections.constructor(
				RawNameBasicDTO.class,
				NAME_BASIC.id,
				NAME_BASIC.nconst,
				NAME_BASIC.primaryName,
				NAME_BASIC.birthYear,
				NAME_BASIC.deathYear,
				NAME_BASIC.primaryProfession,
				NAME_BASIC.knownForTitles
			))
			.from(NAME_BASIC)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(NAME_BASIC.count())
			.from(NAME_BASIC)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<RawNameBasicDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, QRawNameBasic.rawNameBasic);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawNameBasicDTO findById(Long id) {
		Optional<RawNameBasic> rawNameBasic = rawNameBasicRepository.findById(id);
		return rawNameBasic.map(rawNameBasicMapper::mapToDto)
			.orElseThrow(() -> new RawNameBasicNotFoundException("id = %s".formatted(id)));
	}

	public RawNameBasicDTO findByNconst(String nconst) {
		Optional<RawNameBasic> rawNameBasic = rawNameBasicRepository.findByNconst(nconst);
		return rawNameBasic.map(rawNameBasicMapper::mapToDto)
			.orElseThrow(() -> new RawNameBasicNotFoundException("nconst = %s".formatted(nconst)));
	}
}
