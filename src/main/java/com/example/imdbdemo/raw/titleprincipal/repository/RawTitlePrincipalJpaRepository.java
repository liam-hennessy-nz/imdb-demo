package com.example.imdbdemo.raw.titleprincipal.repository;

import com.example.imdbdemo.raw.titleprincipal.entity.RawTitlePrincipal;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawTitlePrincipalJpaRepository extends JpaRepository<@NonNull RawTitlePrincipal, @NonNull Long> {
	Optional<RawTitlePrincipal> findByTconst(String tconst);
}
