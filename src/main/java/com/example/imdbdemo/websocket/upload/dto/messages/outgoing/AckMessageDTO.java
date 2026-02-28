package com.example.imdbdemo.websocket.upload.dto.messages.outgoing;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AckMessageDTO(
	@NotBlank String type,
	@Min(1) int chunkIndex
) implements OutgoingMessageDTO {
	public AckMessageDTO(int chunkIndex) {
		this("ack", chunkIndex);
	}

	public AckMessageDTO {
		type = "ack";
	}
}
