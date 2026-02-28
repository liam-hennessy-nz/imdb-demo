package com.example.imdbdemo.title;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TitleRepository extends JpaRepository<@NonNull Title, @NonNull Long> {}
