package com.example.imdbdemo.raw.titleprincipal.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RawTitlePrincipalQueryRepository {

	private final JPAQueryFactory queryFactory;
}
