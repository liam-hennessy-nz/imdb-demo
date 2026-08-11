package com.example.imdbdemo.raw.titleaka.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.RAW_TITLE_AKA;

import com.example.imdbdemo.raw.titleaka.dto.RawTitleAkaDTO;
import com.example.imdbdemo.raw.titleaka.entity.QRawTitleAka;
import com.example.imdbdemo.raw.titleaka.entity.RawTitleAka;
import com.example.imdbdemo.raw.titleaka.exception.RawTitleAkaNotFoundException;
import com.example.imdbdemo.raw.titleaka.mapper.RawTitleAkaMapper;
import com.example.imdbdemo.raw.titleaka.repository.RawTitleAkaJpaRepository;
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
public class RawTitleAkaService {

	private final JPAQueryFactory queryFactory;
	private final RawTitleAkaJpaRepository rawTitleAkaJpaRepository;
	private final RawTitleAkaMapper rawTitleAkaMapper;

	public Page<RawTitleAkaDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = RawTitleAkaHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, QRawTitleAka.rawTitleAka);

		// Get results and result count for page
		List<RawTitleAka> rawTitleAkaList = selectAll(queryFactory, RAW_TITLE_AKA, predicate, orderSpecifiers, pageable);
		long total = countAll(queryFactory, RAW_TITLE_AKA, predicate);

		List<RawTitleAkaDTO> content = rawTitleAkaMapper.mapToDtoList(rawTitleAkaList);

		return new PageImpl<>(content, pageable, total);
	}

	public RawTitleAkaDTO findById(@NonNull Long id) {
		Optional<RawTitleAka> rawTitleAka = rawTitleAkaJpaRepository.findById(id);
		return rawTitleAka
			.map(rawTitleAkaMapper::mapToDto)
			.orElseThrow(() -> new RawTitleAkaNotFoundException("id", String.valueOf(id)));
	}

	public RawTitleAkaDTO findByTconst(@NonNull String tconst) {
		Optional<RawTitleAka> rawTitleAka = rawTitleAkaJpaRepository.findByTconst(tconst);
		return rawTitleAka
			.map(rawTitleAkaMapper::mapToDto)
			.orElseThrow(() -> new RawTitleAkaNotFoundException("tconst", tconst));
	}
}
