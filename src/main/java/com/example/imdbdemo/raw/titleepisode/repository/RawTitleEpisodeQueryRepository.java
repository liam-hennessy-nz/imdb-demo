package com.example.imdbdemo.raw.titleepisode.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RawTitleEpisodeQueryRepository {

	private final JPAQueryFactory queryFactory;
}
