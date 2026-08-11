package com.example.imdbdemo.raw.titleprincipal.controller;

import com.example.imdbdemo.raw.titleprincipal.dto.RawTitlePrincipalDTO;
import com.example.imdbdemo.raw.titleprincipal.service.RawTitlePrincipalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/raw/title_principal")
@RequiredArgsConstructor
public class RawTitlePrincipalController {

	private final RawTitlePrincipalService rawTitlePrincipalService;

	@GetMapping
	public ResponseEntity<Page<RawTitlePrincipalDTO>> search(
		Pageable pageable,
		@RequestParam MultiValueMap<String, String> params
	) {
		return ResponseEntity.ok(rawTitlePrincipalService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawTitlePrincipalDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawTitlePrincipalService.findById(id));
	}

	@GetMapping("/tconst/{tconst}")
	public ResponseEntity<RawTitlePrincipalDTO> findByTconst(@PathVariable String tconst) {
		return ResponseEntity.ok(rawTitlePrincipalService.findByTconst(tconst));
	}
}
