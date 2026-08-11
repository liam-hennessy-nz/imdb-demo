package com.example.imdbdemo.profession.service;

import static com.example.imdbdemo.shared.PageHelper.*;
import static com.example.imdbdemo.shared.constant.Constants.PROFESSION;

import com.example.imdbdemo.person.dto.PersonProfessionDTO;
import com.example.imdbdemo.profession.dto.ProfessionDTO;
import com.example.imdbdemo.profession.entity.Profession;
import com.example.imdbdemo.profession.exception.ProfessionNotFoundException;
import com.example.imdbdemo.profession.mapper.ProfessionMapper;
import com.example.imdbdemo.profession.repository.ProfessionJpaRepository;
import com.example.imdbdemo.profession.repository.ProfessionQueryRepository;
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
public class ProfessionService {

	private final ProfessionJpaRepository professionJpaRepository;
	private final ProfessionQueryRepository professionQueryRepository;
	private final ProfessionMapper professionMapper;
	private final JPAQueryFactory jpaQueryFactory;

	public Page<ProfessionDTO> search(@NonNull Pageable pageable, @NonNull MultiValueMap<String, String> params) {
		// Extract parameters
		Predicate predicate = ProfessionHelper.toPredicate(params);
		OrderSpecifier<?>[] orderSpecifiers = toOrderSpecifiers(pageable, PROFESSION);

		// Get results and result count for page
		List<Profession> professionList = selectAll(jpaQueryFactory, PROFESSION, predicate, orderSpecifiers, pageable);
		long total = countAll(jpaQueryFactory, PROFESSION, predicate);

		List<ProfessionDTO> content = professionMapper.mapToDtoList(professionList);

		return new PageImpl<>(content, pageable, total);
	}

	public ProfessionDTO findById(@NonNull Long id) {
		Profession profession = professionJpaRepository
			.findById(id)
			.orElseThrow(() -> new ProfessionNotFoundException("id", String.valueOf(id)));
		return professionMapper.mapToDto(profession);
	}

	public List<PersonProfessionDTO> findAllByPersonId(@NonNull List<Long> idList) {
		return professionQueryRepository.findAllByPersonId(idList);
	}
}
