package com.example.imdbdemo.raw.titlerating.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_RATING;

import com.example.imdbdemo.raw.titlerating.dto.RawTitleRatingDTO;
import com.example.imdbdemo.raw.titlerating.entity.RawTitleRating;
import com.example.imdbdemo.raw.titlerating.exception.RawTitleRatingNotFoundException;
import com.example.imdbdemo.raw.titlerating.mapper.RawTitleRatingMapper;
import com.example.imdbdemo.raw.titlerating.repository.RawTitleRatingJpaRepository;
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
public class RawTitleRatingService {

	private final JPAQueryFactory queryFactory;
	private final RawTitleRatingJpaRepository rawTitleRatingJpaRepository;
	private final RawTitleRatingMapper rawTitleRatingMapper;

	public Page<RawTitleRatingDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = RawTitleRatingHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, RAW_TITLE_RATING);

		// Get results and result count for page
		List<RawTitleRating> rawTitleRatingList = selectAll(
			queryFactory,
			RAW_TITLE_RATING,
			predicate,
			orderSpecifiers,
			pageable
		);
		long total = countAll(queryFactory, RAW_TITLE_RATING, predicate);

		List<RawTitleRatingDTO> content = rawTitleRatingMapper.mapToDtoList(rawTitleRatingList);

		return new PageImpl<>(content, pageable, total);
	}

	public RawTitleRatingDTO findById(@NonNull Long id) {
		Optional<RawTitleRating> rawTitleRating = rawTitleRatingJpaRepository.findById(id);
		return rawTitleRating
			.map(rawTitleRatingMapper::mapToDto)
			.orElseThrow(() -> new RawTitleRatingNotFoundException("id", String.valueOf(id)));
	}

	public RawTitleRatingDTO findByTconst(@NonNull String tconst) {
		Optional<RawTitleRating> rawTitleRating = rawTitleRatingJpaRepository.findByTconst(tconst);
		return rawTitleRating
			.map(rawTitleRatingMapper::mapToDto)
			.orElseThrow(() -> new RawTitleRatingNotFoundException("tconst", tconst));
	}
}
