package com.example.imdbdemo.websocket.upload.dto;

import com.example.imdbdemo.websocket.upload.Upload;
import lombok.Builder;
import lombok.Data;

import java.nio.channels.FileChannel;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

@Builder
@Data
public class UploadSessionDTO {
	public Upload upload;
	public AtomicBoolean isWorkerRunning;
	public AtomicBoolean isEofReceived;
	public BlockingQueue<UploadChunkDTO> chunkQueue;
	public FileChannel fileChannel;
}
