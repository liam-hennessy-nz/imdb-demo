package com.example.imdbdemo.alias.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.ALIAS;

import com.example.imdbdemo.alias.dto.AliasDTO;
import com.example.imdbdemo.alias.entity.Alias;
import com.example.imdbdemo.alias.exception.AliasNotFoundException;
import com.example.imdbdemo.alias.mapper.AliasMapper;
import com.example.imdbdemo.alias.repository.AliasJpaRepository;
import com.example.imdbdemo.alias.repository.AliasQueryRepository;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
public class AliasService {

	private final AliasJpaRepository aliasJpaRepository;
	private final AliasQueryRepository aliasQueryRepository;
	private final AliasMapper aliasMapper;
	private final JPAQueryFactory queryFactory;

	public Page<AliasDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = AliasHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, ALIAS);

		// Get results and result count for page
		List<Alias> aliasList = selectAll(queryFactory, ALIAS, predicate, orderSpecifiers, pageable);
		long total = countAll(queryFactory, ALIAS, predicate);

		List<AliasDTO> content = aliasMapper.mapToDtoList(aliasList);

		return new PageImpl<>(content, pageable, total);
	}

	public AliasDTO findById(Long id) {
		Alias alias = aliasJpaRepository
			.findById(id)
			.orElseThrow(() -> new AliasNotFoundException("id", String.valueOf(id)));
		return aliasMapper.mapToDto(alias);
	}
}
