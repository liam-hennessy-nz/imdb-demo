package com.example.imdbdemo.dtos.metadata;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ChunkMetadataDTO {
	private String type;
	private int chunkIndex;
}
