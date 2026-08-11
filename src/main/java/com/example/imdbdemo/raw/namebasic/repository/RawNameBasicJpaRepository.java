package com.example.imdbdemo.raw.namebasic.repository;

import com.example.imdbdemo.raw.namebasic.entity.RawNameBasic;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawNameBasicJpaRepository extends JpaRepository<@NonNull RawNameBasic, @NonNull Long> {
	Optional<RawNameBasic> findByNconst(String nconst);
}
