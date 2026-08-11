package com.example.imdbdemo.raw.titlerating.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RawTitleRatingQueryRepository {

	private final JPAQueryFactory queryFactory;
}
