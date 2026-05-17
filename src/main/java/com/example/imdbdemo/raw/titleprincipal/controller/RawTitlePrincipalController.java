package com.example.imdbdemo.raw.titleprincipal.controller;

import com.example.imdbdemo.raw.titleprincipal.dto.RawTitlePrincipalDTO;
import com.example.imdbdemo.raw.titleprincipal.service.RawTitlePrincipalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/raw/title_principal")
public class RawTitlePrincipalController {
	private final RawTitlePrincipalService rawTitlePrincipalService;

	@GetMapping
	public ResponseEntity<Page<RawTitlePrincipalDTO>> findAll(
		Pageable pageable, @RequestParam Map<String, String> params
	) {
		return ResponseEntity.ok(rawTitlePrincipalService.findAll(pageable, params));
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
