package com.example.imdbdemo.raw.titlebasic.repository;

import com.example.imdbdemo.raw.titlebasic.entity.RawTitleBasic;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawTitleBasicJpaRepository extends JpaRepository<@NonNull RawTitleBasic, @NonNull Long> {
	Optional<RawTitleBasic> findByTconst(String tconst);
}
