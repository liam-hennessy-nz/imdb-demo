package com.example.imdbdemo.websocket.upload.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UploadChunkDTO {
	public int index;
	public byte[] data;
}
