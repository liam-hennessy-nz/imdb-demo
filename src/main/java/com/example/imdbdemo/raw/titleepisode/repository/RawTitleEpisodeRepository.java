package com.example.imdbdemo.raw.titleepisode.repository;

import com.example.imdbdemo.raw.titleepisode.entity.QRawTitleEpisode;
import com.example.imdbdemo.raw.titleepisode.entity.RawTitleEpisode;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RawTitleEpisodeRepository extends
	JpaRepository<RawTitleEpisode, Long>,
	PagingAndSortingRepository<RawTitleEpisode, Long>,
	QuerydslPredicateExecutor<RawTitleEpisode>,
	QuerydslBinderCustomizer<QRawTitleEpisode>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawTitleEpisode root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawTitleEpisode> findByTconst(String tconst);
}
