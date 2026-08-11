package com.example.imdbdemo.profession.repository;

import com.example.imdbdemo.profession.entity.Profession;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionJpaRepository extends JpaRepository<@NonNull Profession, @NonNull Long> {}
