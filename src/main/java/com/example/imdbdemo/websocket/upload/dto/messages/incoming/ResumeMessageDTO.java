package com.example.imdbdemo.websocket.upload.dto.messages.incoming;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ResumeMessageDTO(
	@NotBlank String type,
	@NotBlank UUID uuid
) implements IncomingMessageDTO {
	public ResumeMessageDTO(UUID uuid) {
		this("res", uuid);
	}

	public ResumeMessageDTO {
		type = "res";
	}
}
