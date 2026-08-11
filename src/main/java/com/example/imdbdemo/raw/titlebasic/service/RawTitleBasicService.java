package com.example.imdbdemo.raw.titlebasic.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_BASIC;

import com.example.imdbdemo.raw.titlebasic.dto.RawTitleBasicDTO;
import com.example.imdbdemo.raw.titlebasic.entity.RawTitleBasic;
import com.example.imdbdemo.raw.titlebasic.exception.RawTitleBasicNotFoundException;
import com.example.imdbdemo.raw.titlebasic.mapper.RawTitleBasicMapper;
import com.example.imdbdemo.raw.titlebasic.repository.RawTitleBasicJpaRepository;
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
public class RawTitleBasicService {

	private final JPAQueryFactory queryFactory;
	private final RawTitleBasicJpaRepository rawTitleBasicRepository;
	private final RawTitleBasicMapper rawTitleBasicMapper;

	public Page<RawTitleBasicDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = RawTitleBasicHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, RAW_TITLE_BASIC);

		// Get results and result count for page
		List<RawTitleBasic> rawTitleBasicList = selectAll(
			queryFactory,
			RAW_TITLE_BASIC,
			predicate,
			orderSpecifiers,
			pageable
		);
		long total = countAll(queryFactory, RAW_TITLE_BASIC, predicate);

		List<RawTitleBasicDTO> content = rawTitleBasicMapper.mapToDtoList(rawTitleBasicList);

		return new PageImpl<>(content, pageable, total);
	}

	public RawTitleBasicDTO findById(@NonNull Long id) {
		Optional<RawTitleBasic> rawTitleBasic = rawTitleBasicRepository.findById(id);
		return rawTitleBasic
			.map(rawTitleBasicMapper::mapToDto)
			.orElseThrow(() -> new RawTitleBasicNotFoundException("id", String.valueOf(id)));
	}

	public RawTitleBasicDTO findByTconst(@NonNull String tconst) {
		Optional<RawTitleBasic> rawTitleBasic = rawTitleBasicRepository.findByTconst(tconst);
		return rawTitleBasic
			.map(rawTitleBasicMapper::mapToDto)
			.orElseThrow(() -> new RawTitleBasicNotFoundException("tconst", tconst));
	}
}
