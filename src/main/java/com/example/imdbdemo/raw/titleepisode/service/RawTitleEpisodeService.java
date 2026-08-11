package com.example.imdbdemo.raw.titleepisode.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_EPISODE;

import com.example.imdbdemo.raw.titleepisode.dto.RawTitleEpisodeDTO;
import com.example.imdbdemo.raw.titleepisode.entity.RawTitleEpisode;
import com.example.imdbdemo.raw.titleepisode.exception.RawTitleEpisodeNotFoundException;
import com.example.imdbdemo.raw.titleepisode.mapper.RawTitleEpisodeMapper;
import com.example.imdbdemo.raw.titleepisode.repository.RawTitleEpisodeJpaRepository;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
public class RawTitleEpisodeService {

	private final JPAQueryFactory queryFactory;
	private final RawTitleEpisodeJpaRepository rawTitleEpisodeJpaRepository;
	private final RawTitleEpisodeMapper rawTitleEpisodeMapper;

	public Page<RawTitleEpisodeDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = RawTitleEpisodeHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, RAW_TITLE_EPISODE);

		// Get results and result count for page
		List<RawTitleEpisode> rawTitleEpisodeList = selectAll(
			queryFactory,
			RAW_TITLE_EPISODE,
			predicate,
			orderSpecifiers,
			pageable
		);
		long total = countAll(queryFactory, RAW_TITLE_EPISODE, predicate);

		List<RawTitleEpisodeDTO> content = rawTitleEpisodeMapper.mapToDtoList(rawTitleEpisodeList);

		return new PageImpl<>(content, pageable, total);
	}

	public RawTitleEpisodeDTO findById(@NonNull Long id) {
		Optional<RawTitleEpisode> rawTitleEpisode = rawTitleEpisodeJpaRepository.findById(id);
		return rawTitleEpisode
			.map(rawTitleEpisodeMapper::mapToDto)
			.orElseThrow(() -> new RawTitleEpisodeNotFoundException("id", String.valueOf(id)));
	}

	public RawTitleEpisodeDTO findByTconst(@NonNull String tconst) {
		Optional<RawTitleEpisode> rawTitleEpisode = rawTitleEpisodeJpaRepository.findByTconst(tconst);
		return rawTitleEpisode
			.map(rawTitleEpisodeMapper::mapToDto)
			.orElseThrow(() -> new RawTitleEpisodeNotFoundException("tconst", tconst));
	}
}
