package com.example.imdbdemo.raw.titleepisode.service;

import com.example.imdbdemo.raw.titleepisode.entity.QRawTitleEpisode;
import com.example.imdbdemo.shared.exception.IllegalFilterFieldException;
import com.example.imdbdemo.raw.titleepisode.dto.RawTitleEpisodeDTO;
import com.example.imdbdemo.raw.titleepisode.entity.RawTitleEpisode;
import com.example.imdbdemo.raw.titleepisode.exception.RawTitleEpisodeNotFoundException;
import com.example.imdbdemo.raw.titleepisode.mapper.RawTitleEpisodeMapper;
import com.example.imdbdemo.raw.titleepisode.repository.RawTitleEpisodeRepository;
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
public class RawTitleEpisodeService {
	private final JPAQueryFactory queryFactory;
	private final RawTitleEpisodeRepository rawTitleEpisodeRepository;
	private final RawTitleEpisodeMapper rawTitleEpisodeMapper;

	private static final QRawTitleEpisode TITLE_EPISODE = QRawTitleEpisode.rawTitleEpisode;

	private static Predicate toPredicate(Map<String, String> params) {
		List<ParsedFilter> filters = parseFilters(params);

		BooleanBuilder booleanBuilder = new BooleanBuilder();
		for (ParsedFilter filter : filters) {
			String field = filter.field();
			String operator = filter.operator();
			String value = filter.value();

			switch (field) {
				case "id" -> applyNumberOperator(booleanBuilder, TITLE_EPISODE.id, operator, value, Long::parseLong);
				case "tconst" -> applyStringOperator(booleanBuilder, TITLE_EPISODE.tconst, operator, value);
				case "parentTconst" -> applyStringOperator(booleanBuilder, TITLE_EPISODE.parentTconst, operator, value);
				case "seasonNumber" -> applyStringOperator(booleanBuilder, TITLE_EPISODE.seasonNumber, operator, value);
				case "episodeNumber" -> applyStringOperator(booleanBuilder, TITLE_EPISODE.episodeNumber, operator, value);
				default -> throw new IllegalFilterFieldException(field);
			}
		}

		return booleanBuilder.getValue();
	}

	private Page<RawTitleEpisodeDTO> search(
		Predicate predicate, OrderSpecifier<?>[] orderSpecifiers, Pageable pageable
	) {
		List<RawTitleEpisodeDTO> results = queryFactory
			.select(Projections.constructor(
				RawTitleEpisodeDTO.class,
				TITLE_EPISODE.id,
				TITLE_EPISODE.tconst,
				TITLE_EPISODE.parentTconst,
				TITLE_EPISODE.seasonNumber,
				TITLE_EPISODE.episodeNumber
			))
			.from(TITLE_EPISODE)
			.where(predicate)
			.orderBy(orderSpecifiers)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = queryFactory
			.select(TITLE_EPISODE.count())
			.from(TITLE_EPISODE)
			.where(predicate)
			.fetchOne();

		return new PageImpl<>(results, pageable, total == null ? 0 : total);
	}

	public Page<RawTitleEpisodeDTO> findAll(Pageable pageable, Map<String, String> params) {
		Predicate predicate = toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, TITLE_EPISODE);

		return search(predicate, orderSpecifiers, pageable);
	}

	public RawTitleEpisodeDTO findById(Long id) {
		Optional<RawTitleEpisode> rawTitleEpisode = rawTitleEpisodeRepository.findById(id);
		return rawTitleEpisode.map(rawTitleEpisodeMapper::mapToDto)
			.orElseThrow(() -> new RawTitleEpisodeNotFoundException("id = %s".formatted(id)));
	}

	public RawTitleEpisodeDTO findByTconst(String tconst) {
		Optional<RawTitleEpisode> rawTitleEpisode = rawTitleEpisodeRepository.findByTconst(tconst);
		return rawTitleEpisode.map(rawTitleEpisodeMapper::mapToDto)
			.orElseThrow(() -> new RawTitleEpisodeNotFoundException("tconst = %s".formatted(tconst)));
	}
}
