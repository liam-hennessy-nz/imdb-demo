package com.example.imdbdemo.alias.repository;

import com.example.imdbdemo.alias.entity.Alias;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AliasJpaRepository extends JpaRepository<@NonNull Alias, @NonNull Long> {}
