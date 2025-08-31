package com.example.imdbdemo.dtos.metadata;

import lombok.Data;

@Data
public class FileMetadataDTO {
	private String type;
	private String fileName;
	private long size;
	private long lastModified;
	private int ackInterval;
	private int totalChunks;
}
