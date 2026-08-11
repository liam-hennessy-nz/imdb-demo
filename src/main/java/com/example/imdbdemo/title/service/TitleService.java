package com.example.imdbdemo.title.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.TITLE;

import com.example.imdbdemo.person.dto.PersonTitleDTO;
import com.example.imdbdemo.title.dto.TitleDTO;
import com.example.imdbdemo.title.entity.Title;
import com.example.imdbdemo.title.exception.TitleNotFoundException;
import com.example.imdbdemo.title.mapper.TitleMapper;
import com.example.imdbdemo.title.repository.TitleJpaRepository;
import com.example.imdbdemo.title.repository.TitleQueryRepository;
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
public class TitleService {

	private final TitleJpaRepository titleJpaRepository;
	private final TitleQueryRepository titleQueryRepository;
	private final TitleMapper titleMapper;
	private final JPAQueryFactory jpaQueryFactory;

	public Page<TitleDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		List<String> includes = toIncludes(params);

		Predicate predicate = TitleHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, TITLE);

		List<Title> titleList = selectAll(jpaQueryFactory, TITLE, predicate, orderSpecifiers, pageable);
		long total = countAll(jpaQueryFactory, TITLE, predicate);

		List<TitleDTO> content = titleMapper.mapToDtoList(titleList);

		return new PageImpl<>(content, pageable, total);
	}

	public TitleDTO findById(@NonNull Long id) {
		Title title = titleJpaRepository
			.findById(id)
			.orElseThrow(() -> new TitleNotFoundException("id", String.valueOf(id)));
		return titleMapper.mapToDto(title);
	}

	public List<PersonTitleDTO> findAllByKnownForPersonId(@NonNull List<Long> idList) {
		return titleQueryRepository.findAllByKnownForPersonId(idList);
	}
}
