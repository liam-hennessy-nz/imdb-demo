package com.example.imdbdemo.raw.titlebasic.repository;

import com.example.imdbdemo.raw.titlebasic.entity.QRawTitleBasic;
import com.example.imdbdemo.raw.titlebasic.entity.RawTitleBasic;
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
public interface RawTitleBasicRepository extends
	JpaRepository<RawTitleBasic, Long>,
	PagingAndSortingRepository<RawTitleBasic, Long>,
	QuerydslPredicateExecutor<RawTitleBasic>,
	QuerydslBinderCustomizer<QRawTitleBasic>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawTitleBasic root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawTitleBasic> findByTconst(String tconst);
}
