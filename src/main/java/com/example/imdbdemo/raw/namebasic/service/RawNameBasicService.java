package com.example.imdbdemo.raw.namebasic.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.RAW_NAME_BASIC;

import com.example.imdbdemo.raw.namebasic.dto.RawNameBasicDTO;
import com.example.imdbdemo.raw.namebasic.entity.RawNameBasic;
import com.example.imdbdemo.raw.namebasic.exception.RawNameBasicNotFoundException;
import com.example.imdbdemo.raw.namebasic.mapper.RawNameBasicMapper;
import com.example.imdbdemo.raw.namebasic.repository.RawNameBasicJpaRepository;
import com.example.imdbdemo.raw.namebasic.repository.RawNameBasicQueryRepository;
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
public class RawNameBasicService {

	private final RawNameBasicJpaRepository rawNameBasicJpaRepository;
	private final RawNameBasicQueryRepository rawNameBasicQueryRepository;
	private final JPAQueryFactory queryFactory;
	private final RawNameBasicMapper rawNameBasicMapper;

	public Page<RawNameBasicDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = RawNameBasicHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, RAW_NAME_BASIC);

		// Get results and result count for page
		List<RawNameBasic> rawNameBasicList = selectAll(queryFactory, RAW_NAME_BASIC, predicate, orderSpecifiers, pageable);
		long total = countAll(queryFactory, RAW_NAME_BASIC, predicate);

		List<RawNameBasicDTO> content = rawNameBasicMapper.mapToDtoList(rawNameBasicList);

		return new PageImpl<>(content, pageable, total);
	}

	public RawNameBasicDTO findById(@NonNull Long id) {
		Optional<RawNameBasic> rawNameBasic = rawNameBasicJpaRepository.findById(id);
		return rawNameBasic
			.map(rawNameBasicMapper::mapToDto)
			.orElseThrow(() -> new RawNameBasicNotFoundException("id", String.valueOf(id)));
	}

	public RawNameBasicDTO findByNconst(@NonNull String nconst) {
		Optional<RawNameBasic> rawNameBasic = rawNameBasicJpaRepository.findByNconst(nconst);
		return rawNameBasic
			.map(rawNameBasicMapper::mapToDto)
			.orElseThrow(() -> new RawNameBasicNotFoundException("nconst", nconst));
	}
}
