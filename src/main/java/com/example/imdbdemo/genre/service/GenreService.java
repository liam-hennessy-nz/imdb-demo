package com.example.imdbdemo.genre.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.GENRE;

import com.example.imdbdemo.genre.dto.GenreDTO;
import com.example.imdbdemo.genre.entity.Genre;
import com.example.imdbdemo.genre.exception.GenreNotFoundException;
import com.example.imdbdemo.genre.mapper.GenreMapper;
import com.example.imdbdemo.genre.repository.GenreRepository;
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
public class GenreService {

	private final GenreRepository genreRepository;
	private final GenreMapper genreMapper;
	private final JPAQueryFactory queryFactory;

	public Page<GenreDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = GenreHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, GENRE);

		// Get results and result count for page
		List<Genre> genreList = selectAll(queryFactory, GENRE, predicate, orderSpecifiers, pageable);
		long total = countAll(queryFactory, GENRE, predicate);

		List<GenreDTO> content = genreMapper.mapToDtoList(genreList);

		return new PageImpl<>(content, pageable, total);
	}

	public GenreDTO findById(@NonNull Long id) {
		Genre genre = genreRepository.findById(id).orElseThrow(() -> new GenreNotFoundException("id", String.valueOf(id)));
		return genreMapper.mapToDto(genre);
	}
}
