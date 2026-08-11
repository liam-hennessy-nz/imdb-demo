package com.example.imdbdemo.title.repository;

import static com.example.imdbdemo.shared.constant.Constants.PERSON;
import static com.example.imdbdemo.shared.constant.Constants.TITLE;

import com.example.imdbdemo.person.dto.PersonTitleDTO;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TitleQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<PersonTitleDTO> findAllByKnownForPersonId(List<Long> idList) {
		return queryFactory
			.select(Projections.constructor(PersonTitleDTO.class, PERSON.id, TITLE))
			.from(TITLE)
			.join(TITLE.knownForPerson, PERSON)
			.where(PERSON.id.in(idList))
			.fetch();
	}
}
