package com.example.imdbdemo.character.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.CHARACTER;

import com.example.imdbdemo.character.dto.CharacterDTO;
import com.example.imdbdemo.character.entity.Character;
import com.example.imdbdemo.character.exception.CharacterNotFoundException;
import com.example.imdbdemo.character.mapper.CharacterMapper;
import com.example.imdbdemo.character.repository.CharacterJpaRepository;
import com.example.imdbdemo.character.repository.CharacterQueryRepository;
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
public class CharacterService {

	private final CharacterJpaRepository characterJpaRepository;
	private final CharacterQueryRepository characterQueryRepository;
	private final CharacterMapper characterMapper;
	private final JPAQueryFactory queryFactory;

	public Page<CharacterDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = CharacterHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, CHARACTER);

		// Get results and result count for page
		List<Character> characterList = selectAll(queryFactory, CHARACTER, predicate, orderSpecifiers, pageable);
		long total = countAll(queryFactory, CHARACTER, predicate);

		List<CharacterDTO> content = characterMapper.mapToDtoList(characterList);
		return new PageImpl<>(content, pageable, total);
	}

	public CharacterDTO findById(@NonNull Long id) {
		Character character = characterJpaRepository
			.findById(id)
			.orElseThrow(() -> new CharacterNotFoundException("id", String.valueOf(id)));
		return characterMapper.mapToDto(character);
	}
}
