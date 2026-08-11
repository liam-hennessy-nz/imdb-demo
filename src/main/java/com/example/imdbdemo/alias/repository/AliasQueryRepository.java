package com.example.imdbdemo.alias.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AliasQueryRepository {

	private final JPAQueryFactory queryFactory;
}
