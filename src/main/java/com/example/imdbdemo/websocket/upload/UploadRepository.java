package com.example.imdbdemo.websocket.upload;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UploadRepository extends JpaRepository<@NonNull Upload, @NonNull Long> {
	Optional<@NonNull Upload> findById(@NonNull UUID uuid);
}
