package com.example.imdbdemo.raw.titleepisode.repository;

import com.example.imdbdemo.raw.titleepisode.entity.RawTitleEpisode;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawTitleEpisodeJpaRepository extends JpaRepository<@NonNull RawTitleEpisode, @NonNull Long> {
	Optional<RawTitleEpisode> findByTconst(String tconst);
}
