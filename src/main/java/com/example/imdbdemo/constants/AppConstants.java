package com.example.imdbdemo.constants;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class AppConstants {
	private final int webSocketChunkSize = 1024 * 1024 + 4;
}
