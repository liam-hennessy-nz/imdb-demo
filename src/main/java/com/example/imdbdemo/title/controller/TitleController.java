package com.example.imdbdemo.title.controller;

import com.example.imdbdemo.title.dto.TitleDTO;
import com.example.imdbdemo.title.service.TitleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/title")
@RequiredArgsConstructor
public class TitleController {

	private final TitleService titleService;

	@GetMapping
	public ResponseEntity<Page<TitleDTO>> page(Pageable pageable, @RequestParam MultiValueMap<String, String> params) {
		return ResponseEntity.ok(titleService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<TitleDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(titleService.findById(id));
	}
}
