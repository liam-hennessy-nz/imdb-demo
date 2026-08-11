package com.example.imdbdemo.upload.dto.messages.incoming;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EofMessageDTO(@NotBlank String type, @NotNull UUID uuid) implements IncomingMessageDTO {
	public EofMessageDTO(UUID uuid) {
		this("eof", uuid);
	}

	public EofMessageDTO {
		type = "eof";
	}
}
