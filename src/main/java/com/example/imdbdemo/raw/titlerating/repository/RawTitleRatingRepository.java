package com.example.imdbdemo.raw.titlerating.repository;

import com.example.imdbdemo.raw.titlerating.entity.QRawTitleRating;
import com.example.imdbdemo.raw.titlerating.entity.RawTitleRating;
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
public interface RawTitleRatingRepository extends
	JpaRepository<RawTitleRating, Long>,
	PagingAndSortingRepository<RawTitleRating, Long>,
	QuerydslPredicateExecutor<RawTitleRating>,
	QuerydslBinderCustomizer<QRawTitleRating>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawTitleRating root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawTitleRating> findByTconst(String tconst);
}
