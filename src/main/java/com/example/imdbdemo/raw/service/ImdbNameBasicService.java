package com.example.imdbdemo.raw.service;

import com.example.imdbdemo.raw.dto.ImdbNameBasicDTO;
import com.example.imdbdemo.raw.entity.ImdbNameBasic;
import com.example.imdbdemo.raw.entity.QImdbNameBasic;
import com.example.imdbdemo.raw.exception.ImdbNameBasicNotFoundException;
import com.example.imdbdemo.raw.mapper.ImdbNameBasicMapper;
import com.example.imdbdemo.raw.repository.ImdbNameBasicRepository;
import com.example.imdbdemo.shared.dto.PageRequestDTO;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class ImdbNameBasicService {

	private final JPAQueryFactory queryFactory;

	private final ImdbNameBasicRepository imdbNameBasicRepository;
	private final ImdbNameBasicMapper imdbNameBasicMapper;

	public ImdbNameBasicService(JPAQueryFactory queryFactory, ImdbNameBasicRepository imdbNameBasicRepository, ImdbNameBasicMapper imdbNameBasicMapper) {
		this.queryFactory = queryFactory;
		this.imdbNameBasicRepository = imdbNameBasicRepository;
		this.imdbNameBasicMapper = imdbNameBasicMapper;
	}

	public Page<@NonNull ImdbNameBasicDTO> filter(PageRequestDTO request) {

		QImdbNameBasic nameBasic = QImdbNameBasic.imdbNameBasic;

		// Build predicate dynamically
		BooleanBuilder predicate = new BooleanBuilder();

		if (request.getFilter() != null) {
			for (Map.Entry<String, PageRequestDTO.FilterConstraint> entry : request.getFilter().entrySet()) {
				String field = entry.getKey();
				PageRequestDTO.FilterConstraint constraint = entry.getValue();

				String matchMode = constraint.getMatchMode();
				String value = constraint.getValue();

				if (StringUtils.isBlank(value)) continue;

				switch (field) {
					case "nconst":
						switch (matchMode) {
							case "startsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.nconst.startsWith(value));
								break;
							case "contains":
								predicate.and(QImdbNameBasic.imdbNameBasic.nconst.contains(value));
								break;
							case "notContains":
								predicate.and(QImdbNameBasic.imdbNameBasic.nconst.contains(value).not());
								break;
							case "endsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.nconst.endsWith(value));
								break;
							case "equals":
								predicate.and(QImdbNameBasic.imdbNameBasic.nconst.eq(value));
								break;
							case "notEquals":
								predicate.and(QImdbNameBasic.imdbNameBasic.nconst.ne(value));
								break;
							default:
								break;
						}
						break;
					case "primaryName":
						switch (matchMode) {
							case "startsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.startsWith(value));
								break;
							case "contains":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.contains(value));
								break;
							case "notContains":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.contains(value).not());
								break;
							case "endsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.endsWith(value));
								break;
							case "equals":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.eq(value));
								break;
							case "notEquals":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.ne(value));
								break;
							default:
								break;
						}
						break;
					case "birthYear":
						switch (matchMode) {
							case "startsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.startsWith(value));
								break;
							case "contains":
								predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.contains(value));
								break;
							case "notContains":
								predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.contains(value).not());
								break;
							case "endsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.endsWith(value));
								break;
							case "equals":
								predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.eq(value));
								break;
							case "notEquals":
								predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.ne(value));
								break;
							default:
								break;
						}
						break;
					case "deathYear":
						switch (matchMode) {
							case "startsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.startsWith(value));
								break;
							case "contains":
								predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.contains(value));
								break;
							case "notContains":
								predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.contains(value).not());
								break;
							case "endsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.endsWith(value));
								break;
							case "equals":
								predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.eq(value));
								break;
							case "notEquals":
								predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.ne(value));
								break;
							default:
								break;
						}
						break;
					case "primaryProfession":
						switch (matchMode) {
							case "startsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.startsWith(value));
								break;
							case "contains":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.contains(value));
								break;
							case "notContains":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.contains(value).not());
								break;
							case "endsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.endsWith(value));
								break;
							case "equals":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.eq(value));
								break;
							case "notEquals":
								predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.ne(value));
								break;
							default:
								break;
						}
						break;
					case "knownForTitles":
						switch (matchMode) {
							case "startsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.startsWith(value));
								break;
							case "contains":
								predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.contains(value));
								break;
							case "notContains":
								predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.contains(value).not());
								break;
							case "endsWith":
								predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.endsWith(value));
								break;
							case "equals":
								predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.eq(value));
								break;
							case "notEquals":
								predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.ne(value));
								break;
							default:
								break;
						}
						break;
					default:
						break;
				}
			}
		}

		// Sorting
		List<OrderSpecifier<String>> sortOrder = new ArrayList<>();

		if (request.getSort() != null) {
			PathBuilder<ImdbNameBasic> path = new PathBuilder<>(ImdbNameBasic.class, "imdbNameBasic");

			for (Map.Entry<String, Integer> entry : request.getSort().entrySet()) {
				String field = entry.getKey();
				Integer order = entry.getValue();

				if (order == 1) {
					sortOrder.add(path.getString(field).asc());
				} else if (order == -1) {
					sortOrder.add(path.getString(field).desc());
				}
			}
		}

		Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

		List<ImdbNameBasicDTO> results = queryFactory
			.select(Projections.constructor(
				ImdbNameBasicDTO.class,
				nameBasic.id,
				nameBasic.nconst,
				nameBasic.primaryName,
				nameBasic.birthYear,
				nameBasic.deathYear,
				nameBasic.primaryProfession,
				nameBasic.knownForTitles
			))
			.from(nameBasic)
			.where(predicate)
			.orderBy(sortOrder.toArray(OrderSpecifier[]::new))
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(nameBasic.count())
			.from(nameBasic)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<@NonNull ImdbNameBasicDTO> findAll(Pageable pageable) {
		return imdbNameBasicRepository.findAll(pageable).map(imdbNameBasicMapper::mapToDto);
	}

	public ImdbNameBasicDTO findById(Long id) {
		Optional<ImdbNameBasic> imdbNameBasic = imdbNameBasicRepository.findById(id);
		return imdbNameBasic.map(imdbNameBasicMapper::mapToDto)
			.orElseThrow(() -> new ImdbNameBasicNotFoundException("id = %s".formatted(id)));
	}

	public ImdbNameBasicDTO findByNconst(String nconst) {
		Optional<ImdbNameBasic> imdbNameBasic = imdbNameBasicRepository.findByNconst(nconst);
		return imdbNameBasic.map(imdbNameBasicMapper::mapToDto)
			.orElseThrow(() -> new ImdbNameBasicNotFoundException("nconst = %s".formatted(nconst)));
	}
}
