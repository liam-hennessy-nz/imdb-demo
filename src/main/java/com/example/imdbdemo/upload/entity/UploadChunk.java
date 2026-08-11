package com.example.imdbdemo.upload.entity;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UploadChunk {

	public int index;
	public byte[] data;
}
