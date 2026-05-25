package com.example.imdbdemo.raw.titlerating.controller;

import com.example.imdbdemo.raw.titlerating.dto.RawTitleRatingDTO;
import com.example.imdbdemo.raw.titlerating.service.RawTitleRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/raw/titlerating")
public class RawTitleRatingController {
	private final RawTitleRatingService rawTitleRatingService;

	@GetMapping
	public ResponseEntity<Page<RawTitleRatingDTO>> findAll(
		Pageable pageable, @RequestParam Map<String, String> params
	) {
		return ResponseEntity.ok(rawTitleRatingService.findAll(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawTitleRatingDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawTitleRatingService.findById(id));
	}

	@GetMapping("/tconst/{tconst}")
	public ResponseEntity<RawTitleRatingDTO> findByTconst(@PathVariable String tconst) {
		return ResponseEntity.ok(rawTitleRatingService.findByTconst(tconst));
	}
}
