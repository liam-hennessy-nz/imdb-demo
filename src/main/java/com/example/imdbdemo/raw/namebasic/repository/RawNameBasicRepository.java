package com.example.imdbdemo.raw.namebasic.repository;

import com.example.imdbdemo.raw.namebasic.entity.QRawNameBasic;
import com.example.imdbdemo.raw.namebasic.entity.RawNameBasic;
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
public interface RawNameBasicRepository extends
	JpaRepository<RawNameBasic, Long>,
	PagingAndSortingRepository<RawNameBasic, Long>,
	QuerydslPredicateExecutor<RawNameBasic>,
	QuerydslBinderCustomizer<QRawNameBasic>
{
	@Override
	default void customize(QuerydslBindings bindings, @NonNull QRawNameBasic root) {
		bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::eq);
	}

	Optional<RawNameBasic> findByNconst(String nconst);
}
