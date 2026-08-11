package com.example.imdbdemo.upload.service;

import com.example.imdbdemo.upload.entity.Upload;
import java.nio.channels.FileChannel;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.socket.WebSocketSession;

@RequiredArgsConstructor
@Data
public class UploadSession {

	private final WebSocketSession webSocketSession;
	private final Map<Integer, byte[]> chunkBuffer = new ConcurrentHashMap<>();
	private final ReentrantLock drainBufferLock = new ReentrantLock();
	private final AtomicInteger nextChunkIndex = new AtomicInteger(0);

	private Upload upload;
	private FileChannel fileChannel;
}
