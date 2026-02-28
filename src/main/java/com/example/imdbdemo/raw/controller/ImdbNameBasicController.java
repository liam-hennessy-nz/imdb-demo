package com.example.imdbdemo.raw.controller;

import com.example.imdbdemo.raw.dto.ImdbNameBasicDTO;
import com.example.imdbdemo.raw.service.ImdbNameBasicService;
import com.example.imdbdemo.shared.dto.PageRequestDTO;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/imdb/name_basic")
public class ImdbNameBasicController {

	private final ImdbNameBasicService imdbNameBasicService;

	public ImdbNameBasicController(ImdbNameBasicService imdbNameBasicService) {
		this.imdbNameBasicService = imdbNameBasicService;
	}

	@GetMapping("/")
	public ResponseEntity<@NonNull Page<@NonNull ImdbNameBasicDTO>> findAll(Pageable pageable) {
		return ResponseEntity.ok(imdbNameBasicService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<@NonNull ImdbNameBasicDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(imdbNameBasicService.findById(id));
	}

	@GetMapping("/nconst/{nconst}")
	public ResponseEntity<@NonNull ImdbNameBasicDTO> findByNconst(@PathVariable String nconst) {
		return ResponseEntity.ok(imdbNameBasicService.findByNconst(nconst));
	}

	@PostMapping("/filter")
	public ResponseEntity<@NonNull Page<@NonNull ImdbNameBasicDTO>> filter(@RequestBody PageRequestDTO pageRequestDTO) {
		return ResponseEntity.ok(imdbNameBasicService.filter(pageRequestDTO));
	}
}
