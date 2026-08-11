package com.example.imdbdemo.person.repository;

import com.example.imdbdemo.person.entity.Person;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonJpaRepository extends JpaRepository<@NonNull Person, @NonNull Long> {}
