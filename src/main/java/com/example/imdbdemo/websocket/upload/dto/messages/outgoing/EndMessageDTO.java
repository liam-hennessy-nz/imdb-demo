package com.example.imdbdemo.websocket.upload.dto.messages.outgoing;

import jakarta.validation.constraints.NotBlank;

public record EndMessageDTO(
	@NotBlank String type
) implements OutgoingMessageDTO {
	public EndMessageDTO() {
		this("end");
	}

	public EndMessageDTO {
		type = "end";
	}
}
