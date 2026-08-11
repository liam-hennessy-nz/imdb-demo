package com.example.imdbdemo.upload.dto.messages.incoming;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ResumeMessageDTO(@NotBlank String type, @NotNull UUID uuid) implements IncomingMessageDTO {
	public ResumeMessageDTO(UUID uuid) {
		this("res", uuid);
	}

	public ResumeMessageDTO {
		type = "res";
	}
}
