package com.example.imdbdemo.dtos;

import lombok.Data;

@Data
public class FileMetadata {
	private String type;
	private String fileName;
	private long size;
	private long lastModified;
}
