package com.example.imdbdemo.services.imdb;

import com.example.imdbdemo.dtos.PageRequestDTO;
import com.example.imdbdemo.dtos.imdb.ImdbNameBasicDTO;
import com.example.imdbdemo.entities.imdb.ImdbNameBasic;
import com.example.imdbdemo.entities.imdb.QImdbNameBasic;
import com.example.imdbdemo.exceptions.imdb.ImdbNameBasicNotFoundException;
import com.example.imdbdemo.mappers.imdb.ImdbNameBasicMapper;
import com.example.imdbdemo.repositories.imdb.ImdbNameBasicRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
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

	public Page<ImdbNameBasicDTO> filter(PageRequestDTO request) {

		QImdbNameBasic nameBasic = QImdbNameBasic.imdbNameBasic;

		// Build predicate dynamically
		BooleanBuilder predicate = new BooleanBuilder();

		if (request.getFilter() != null) {
			for (Map.Entry<String, PageRequestDTO.FilterMetadata> entry : request.getFilter().entrySet()) {
				String field = entry.getKey();
				String operator = entry.getValue().getOperator();
				for (PageRequestDTO.FilterConstraint constraint : entry.getValue().getConstraints()) {
					String value = constraint.getValue();
					String matchMode = constraint.getMatchMode();

					if (StringUtils.isNotBlank(value)) {
						switch (field) {
							case "nconst":
								if ("contains".equals(matchMode)) {
									predicate.and(QImdbNameBasic.imdbNameBasic.nconst.contains(value));
								}
								break;
							case "primaryName":
								if ("equals".equals(matchMode)) {
									predicate.and(QImdbNameBasic.imdbNameBasic.primaryName.eq(value));
								}
								break;
							case "birthYear":
								if ("equals".equals(matchMode)) {
									predicate.and(QImdbNameBasic.imdbNameBasic.birthYear.eq(value));
								}
								break;
							case "deathYear":
								if ("equals".equals(matchMode)) {
									predicate.and(QImdbNameBasic.imdbNameBasic.deathYear.eq(value));
								}
								break;
							case "primaryProfession":
								if ("equals".equals(matchMode)) {
									predicate.and(QImdbNameBasic.imdbNameBasic.primaryProfession.eq(value));
								}
								break;
							case "knownForTitles":
								if ("equals".equals(matchMode)) {
									predicate.and(QImdbNameBasic.imdbNameBasic.knownForTitles.eq(value));
								}
								break;
							default:
								break;
						}
					}
				}
			}
		}

		// Sorting
		List<OrderSpecifier<String>> sortOrder = new ArrayList<>();

		if (request.getSort() != null) {
			PathBuilder<ImdbNameBasic> path = new PathBuilder<>(ImdbNameBasic.class, "imdbNameBasic");

			for (PageRequestDTO.SortMetadata sort : request.getSort()) {
				String field = sort.getField();
				Integer order = sort.getOrder();

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


	public Page<ImdbNameBasicDTO> findAll(Pageable pageable) {
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
