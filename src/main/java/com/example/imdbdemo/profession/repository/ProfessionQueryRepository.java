package com.example.imdbdemo.profession.repository;

import static com.example.imdbdemo.shared.constant.Constants.PERSON;
import static com.example.imdbdemo.shared.constant.Constants.PROFESSION;

import com.example.imdbdemo.person.dto.PersonProfessionDTO;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProfessionQueryRepository {

	private final JPAQueryFactory jpaQueryFactory;

	public List<PersonProfessionDTO> findAllByPersonId(List<Long> idList) {
		return jpaQueryFactory
			.select(Projections.constructor(PersonProfessionDTO.class, PERSON.id, PROFESSION))
			.from(PROFESSION)
			.join(PROFESSION.person, PERSON)
			.where(PERSON.id.in(idList))
			.fetch();
	}
}
