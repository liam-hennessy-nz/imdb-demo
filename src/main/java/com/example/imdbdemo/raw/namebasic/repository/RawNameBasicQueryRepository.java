package com.example.imdbdemo.raw.namebasic.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RawNameBasicQueryRepository {

	private final JPAQueryFactory queryFactory;
}
