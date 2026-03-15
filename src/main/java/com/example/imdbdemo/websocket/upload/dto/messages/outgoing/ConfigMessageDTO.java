package com.example.imdbdemo.websocket.upload.dto.messages.outgoing;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ConfigMessageDTO(
	@NotBlank String type,
	@NotBlank UUID uuid,
	@Min(0) int chunkIndex,
	@Min(1) int chunkByteSize,
	@Min(1) int chunkAckInterval,
	@Min(1) int chunkInFlightMax
) implements OutgoingMessageDTO {
	public ConfigMessageDTO(UUID uuid, int chunkIndex, int chunkByteSize, int chunkAckInterval, int chunkInFlightMax) {
		this("cfg", uuid, chunkIndex, chunkByteSize, chunkAckInterval, chunkInFlightMax);
	}

	public ConfigMessageDTO {
		type = "cfg";
	}
}
