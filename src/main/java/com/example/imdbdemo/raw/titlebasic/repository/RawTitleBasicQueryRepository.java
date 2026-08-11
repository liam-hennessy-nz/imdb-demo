package com.example.imdbdemo.raw.titlebasic.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RawTitleBasicQueryRepository {

	private final JPAQueryFactory queryFactory;
}
