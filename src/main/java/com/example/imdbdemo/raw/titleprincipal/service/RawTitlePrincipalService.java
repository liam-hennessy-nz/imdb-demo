package com.example.imdbdemo.raw.titleprincipal.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_PRINCIPAL;

import com.example.imdbdemo.raw.titleprincipal.dto.RawTitlePrincipalDTO;
import com.example.imdbdemo.raw.titleprincipal.entity.RawTitlePrincipal;
import com.example.imdbdemo.raw.titleprincipal.exception.RawTitlePrincipalNotFoundException;
import com.example.imdbdemo.raw.titleprincipal.mapper.RawTitlePrincipalMapper;
import com.example.imdbdemo.raw.titleprincipal.repository.RawTitlePrincipalJpaRepository;
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
public class RawTitlePrincipalService {

	private final JPAQueryFactory queryFactory;
	private final RawTitlePrincipalJpaRepository rawTitlePrincipalJpaRepository;
	private final RawTitlePrincipalMapper rawTitlePrincipalMapper;

	public Page<RawTitlePrincipalDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = RawTitlePrincipalHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, RAW_TITLE_PRINCIPAL);

		// Get results and result count for page
		List<RawTitlePrincipal> rawTitlePrincipalList = selectAll(
			queryFactory,
			RAW_TITLE_PRINCIPAL,
			predicate,
			orderSpecifiers,
			pageable
		);
		long total = countAll(queryFactory, RAW_TITLE_PRINCIPAL, predicate);

		List<RawTitlePrincipalDTO> content = rawTitlePrincipalMapper.mapToDtoList(rawTitlePrincipalList);

		return new PageImpl<>(content, pageable, total);
	}

	public RawTitlePrincipalDTO findById(@NonNull Long id) {
		Optional<RawTitlePrincipal> rawTitlePrincipal = rawTitlePrincipalJpaRepository.findById(id);
		return rawTitlePrincipal
			.map(rawTitlePrincipalMapper::mapToDto)
			.orElseThrow(() -> new RawTitlePrincipalNotFoundException("id", String.valueOf(id)));
	}

	public RawTitlePrincipalDTO findByTconst(@NonNull String tconst) {
		Optional<RawTitlePrincipal> rawTitlePrincipal = rawTitlePrincipalJpaRepository.findByTconst(tconst);
		return rawTitlePrincipal
			.map(rawTitlePrincipalMapper::mapToDto)
			.orElseThrow(() -> new RawTitlePrincipalNotFoundException("tconst", tconst));
	}
}
