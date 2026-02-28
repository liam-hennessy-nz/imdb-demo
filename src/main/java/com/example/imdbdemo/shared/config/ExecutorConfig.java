package com.example.imdbdemo.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class ExecutorConfig {

	@Bean(name = "streamingExecutor")
	public ExecutorService streamingExecutor() {
		return Executors.newSingleThreadExecutor();
	}

	@Bean(name = "messageExecutor")
	public ExecutorService messageExecutor() {
		return Executors.newThreadPerTaskExecutor(Thread.ofVirtual().factory());
	}

	@Bean(name = "workerExecutor")
	public ExecutorService workerExecutor() {
		return Executors.newThreadPerTaskExecutor(Thread.ofVirtual().factory());
	}
}
