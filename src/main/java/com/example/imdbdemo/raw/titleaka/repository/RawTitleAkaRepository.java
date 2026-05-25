package com.example.imdbdemo.raw.titleaka.repository;

import com.example.imdbdemo.raw.titleaka.entity.QRawTitleAka;
import com.example.imdbdemo.raw.titleaka.entity.RawTitleAka;
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
public interface RawTitleAkaRepository extends
	JpaRepository<RawTitleAka, Long>,
	PagingAndSortingRepository<RawTitleAka, Long>,
	QuerydslPredicateExecutor<RawTitleAka>,
	QuerydslBinderCustomizer<QRawTitleAka>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawTitleAka root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawTitleAka> findByTconst(String tconst);
}
