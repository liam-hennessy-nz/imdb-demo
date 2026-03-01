package com.example.imdbdemo.websocket.upload.dto.messages.incoming;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record EofMessageDTO(@NotBlank String type, @NotBlank UUID uuid) implements IncomingMessageDTO {
	public EofMessageDTO(UUID uuid) {
		this("eof", uuid);
	}

	public EofMessageDTO {
		type = "eof";
	}
}
