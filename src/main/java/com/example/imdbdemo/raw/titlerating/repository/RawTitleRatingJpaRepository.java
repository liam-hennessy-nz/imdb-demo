package com.example.imdbdemo.raw.titlerating.repository;

import com.example.imdbdemo.raw.titlerating.entity.RawTitleRating;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawTitleRatingJpaRepository extends JpaRepository<@NonNull RawTitleRating, @NonNull Long> {
	Optional<RawTitleRating> findByTconst(String tconst);
}
