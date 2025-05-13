package com.example.imdbdemo.controllers;

import com.example.imdbdemo.dtos.UploadResponseDTO;
import com.example.imdbdemo.services.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
public class UploadController {

	private final UploadService uploadService;

	public UploadController(UploadService uploadService) {
		this.uploadService = uploadService;
	}

	@PostMapping("/tsv/titles")
	public ResponseEntity<UploadResponseDTO> uploadTitles(@RequestParam("file") MultipartFile file) {
		return ResponseEntity.ok(uploadService.uploadTitles(file));
	}

	@PostMapping("/tsv/aliases")
	public ResponseEntity<Boolean> uploadAliases(@RequestParam("file") MultipartFile file) {
		return ResponseEntity.ok(uploadService.uploadAliases(file));
	}
}
