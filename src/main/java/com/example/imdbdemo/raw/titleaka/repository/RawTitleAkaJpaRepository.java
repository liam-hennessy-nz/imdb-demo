package com.example.imdbdemo.raw.titleaka.repository;

import com.example.imdbdemo.raw.titleaka.entity.RawTitleAka;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawTitleAkaJpaRepository extends JpaRepository<@NonNull RawTitleAka, @NonNull Long> {
	Optional<RawTitleAka> findByTconst(String tconst);
}
