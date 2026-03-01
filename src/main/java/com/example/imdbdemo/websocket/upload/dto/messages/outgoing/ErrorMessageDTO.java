package com.example.imdbdemo.websocket.upload.dto.messages.outgoing;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ErrorMessageDTO(
	@NotBlank String type,
	@Min(1) int code,
	@NotBlank String reason
) implements OutgoingMessageDTO {
	public ErrorMessageDTO(int code, String reason) {
		this("err", code, reason);
	}

	public ErrorMessageDTO {
		type = "err";
	}
}
