package com.example.imdbdemo.raw.titleaka.controller;

import com.example.imdbdemo.raw.titleaka.dto.RawTitleAkaDTO;
import com.example.imdbdemo.raw.titleaka.service.RawTitleAkaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/raw/title_aka")
public class RawTitleAkaController {
	private final RawTitleAkaService rawTitleAkaService;

	@GetMapping
	public ResponseEntity<Page<RawTitleAkaDTO>> findAll(
		Pageable pageable, @RequestParam Map<String, String> params
	) {
		return ResponseEntity.ok(rawTitleAkaService.findAll(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawTitleAkaDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawTitleAkaService.findById(id));
	}

	@GetMapping("/tconst/{tconst}")
	public ResponseEntity<RawTitleAkaDTO> findByTconst(@PathVariable String tconst) {
		return ResponseEntity.ok(rawTitleAkaService.findByTconst(tconst));
	}
}
