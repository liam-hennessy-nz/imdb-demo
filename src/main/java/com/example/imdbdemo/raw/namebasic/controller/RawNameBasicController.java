package com.example.imdbdemo.raw.namebasic.controller;

import com.example.imdbdemo.raw.namebasic.dto.RawNameBasicDTO;
import com.example.imdbdemo.raw.namebasic.service.RawNameBasicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/raw/name_basic")
public class RawNameBasicController {
	private final RawNameBasicService rawNameBasicService;

	@GetMapping
	public ResponseEntity<Page<RawNameBasicDTO>> findAll(
		Pageable pageable, @RequestParam Map<String, String> params
	) {
		return ResponseEntity.ok(rawNameBasicService.findAll(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawNameBasicDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawNameBasicService.findById(id));
	}

	@GetMapping("/nconst/{nconst}")
	public ResponseEntity<RawNameBasicDTO> findByNconst(@PathVariable String nconst) {
		return ResponseEntity.ok(rawNameBasicService.findByNconst(nconst));
	}
}
