package com.example.imdbdemo.websocket.upload.repository;

import com.example.imdbdemo.websocket.upload.entity.Upload;
import java.util.Optional;
import java.util.UUID;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadRepository extends JpaRepository<@NonNull Upload, @NonNull Long> {
	Optional<@NonNull Upload> findById(@NonNull UUID uuid);
}
