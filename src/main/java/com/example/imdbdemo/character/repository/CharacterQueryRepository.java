package com.example.imdbdemo.character.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CharacterQueryRepository {

	private final JPAQueryFactory queryFactory;
}
