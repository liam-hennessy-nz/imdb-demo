package com.example.imdbdemo.raw.titlecrew.repository;

import com.example.imdbdemo.raw.titlecrew.entity.QRawTitleCrew;
import com.example.imdbdemo.raw.titlecrew.entity.RawTitleCrew;
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
public interface RawTitleCrewRespository extends
	JpaRepository<RawTitleCrew, Long>,
	PagingAndSortingRepository<RawTitleCrew, Long>,
	QuerydslPredicateExecutor<RawTitleCrew>,
	QuerydslBinderCustomizer<QRawTitleCrew>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawTitleCrew root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawTitleCrew> findByTconst(String tconst);
}
