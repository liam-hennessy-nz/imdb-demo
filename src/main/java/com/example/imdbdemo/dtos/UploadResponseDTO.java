package com.example.imdbdemo.dtos;

import lombok.Data;

import java.util.Map;

@Data
public class UploadResponseDTO {
	private Map<Long, String> errors;
}
