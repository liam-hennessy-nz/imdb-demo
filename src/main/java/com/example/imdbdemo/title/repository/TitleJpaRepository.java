package com.example.imdbdemo.title.repository;

import com.example.imdbdemo.title.entity.Title;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TitleJpaRepository extends JpaRepository<@NonNull Title, @NonNull Long> {}
