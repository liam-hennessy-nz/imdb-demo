package com.example.imdbdemo.websocket.upload.dto.messages.incoming;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record MetadataMessageDTO(
	@NotBlank String type,
	@NotBlank String datasetKey,
	@Min(1) long byteSize,
	@Min(1) long lastModified
) implements IncomingMessageDTO {
	public MetadataMessageDTO(String datasetKey, long byteSize, long lastModified) {
		this("meta", datasetKey, byteSize, lastModified);
	}

	public MetadataMessageDTO {
		type = "meta";
	}
}
