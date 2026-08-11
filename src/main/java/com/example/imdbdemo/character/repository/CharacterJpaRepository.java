package com.example.imdbdemo.character.repository;

import com.example.imdbdemo.character.entity.Character;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacterJpaRepository extends JpaRepository<@NonNull Character, @NonNull Long> {}
