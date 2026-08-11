package com.example.imdbdemo.raw.namebasic.controller;

import com.example.imdbdemo.raw.namebasic.dto.RawNameBasicDTO;
import com.example.imdbdemo.raw.namebasic.service.RawNameBasicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/raw/name_basic")
@RequiredArgsConstructor
public class RawNameBasicController {

	private final RawNameBasicService rawNameBasicService;

	@GetMapping
	public ResponseEntity<Page<RawNameBasicDTO>> search(
		Pageable pageable,
		@RequestParam MultiValueMap<String, String> params
	) {
		return ResponseEntity.ok(rawNameBasicService.search(pageable, params));
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
