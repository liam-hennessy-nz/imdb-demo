package com.example.imdbdemo.genre.repository;

import com.example.imdbdemo.genre.entity.Genre;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<@NonNull Genre, @NonNull Long> {}
