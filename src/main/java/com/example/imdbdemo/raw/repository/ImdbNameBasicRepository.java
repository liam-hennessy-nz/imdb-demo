package com.example.imdbdemo.raw.repository;

import com.example.imdbdemo.raw.entity.ImdbNameBasic;
import com.example.imdbdemo.raw.entity.QImdbNameBasic;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImdbNameBasicRepository extends
	JpaRepository<ImdbNameBasic, Long>,
	PagingAndSortingRepository<ImdbNameBasic, Long>,
	QuerydslPredicateExecutor<ImdbNameBasic>,
	QuerydslBinderCustomizer<QImdbNameBasic>
{

	@Override
	default void customize(QuerydslBindings bindings, @NonNull QImdbNameBasic root) {
		bindings.bind(String.class)
			.first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<ImdbNameBasic> findByNconst(String nconst);
}
