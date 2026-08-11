package com.example.imdbdemo.person.repository;

import static com.example.imdbdemo.shared.constant.Constants.PERSON;
import static com.example.imdbdemo.shared.constant.Constants.TITLE;

import com.example.imdbdemo.title.dto.TitlePersonDTO;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PersonQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<TitlePersonDTO> findAllByKnownForPersonId(List<Long> idList) {
		return queryFactory
			.select(Projections.constructor(TitlePersonDTO.class, PERSON.id, TITLE))
			.from(PERSON)
			.innerJoin(PERSON.knownForTitle, TITLE)
			.where(PERSON.id.in(idList))
			.fetch();
	}
}
