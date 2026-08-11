package com.example.imdbdemo.upload.repository;

import com.example.imdbdemo.upload.entity.Upload;
import java.util.Optional;
import java.util.UUID;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadRepository extends JpaRepository<@NonNull Upload, @NonNull Long> {
	Optional<Upload> findByUuid(UUID uuid);
}
