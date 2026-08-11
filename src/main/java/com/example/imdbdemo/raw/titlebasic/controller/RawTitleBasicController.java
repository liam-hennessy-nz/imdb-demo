package com.example.imdbdemo.raw.titlebasic.controller;

import com.example.imdbdemo.raw.titlebasic.dto.RawTitleBasicDTO;
import com.example.imdbdemo.raw.titlebasic.service.RawTitleBasicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/raw/title_basic")
@RequiredArgsConstructor
public class RawTitleBasicController {

	private final RawTitleBasicService rawTitleBasicService;

	@GetMapping
	public ResponseEntity<Page<RawTitleBasicDTO>> search(
		Pageable pageable,
		@RequestParam MultiValueMap<String, String> params
	) {
		return ResponseEntity.ok(rawTitleBasicService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawTitleBasicDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawTitleBasicService.findById(id));
	}

	@GetMapping("/tconst/{tconst}")
	public ResponseEntity<RawTitleBasicDTO> findByTconst(@PathVariable String tconst) {
		return ResponseEntity.ok(rawTitleBasicService.findByTconst(tconst));
	}
}
