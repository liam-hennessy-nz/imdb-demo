package com.example.imdbdemo.raw.titleaka.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RawTitleAkaQueryRepository {

	private final JPAQueryFactory queryFactory;
}
