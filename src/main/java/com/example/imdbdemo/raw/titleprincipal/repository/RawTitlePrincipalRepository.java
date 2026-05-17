package com.example.imdbdemo.raw.titleprincipal.repository;

import com.example.imdbdemo.raw.titleprincipal.entity.QRawTitlePrincipal;
import com.example.imdbdemo.raw.titleprincipal.entity.RawTitlePrincipal;
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
public interface RawTitlePrincipalRepository extends
	JpaRepository<RawTitlePrincipal, Long>,
	PagingAndSortingRepository<RawTitlePrincipal, Long>,
	QuerydslPredicateExecutor<RawTitlePrincipal>,
	QuerydslBinderCustomizer<QRawTitlePrincipal>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawTitlePrincipal root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawTitlePrincipal> findByTconst(String tconst);
}
