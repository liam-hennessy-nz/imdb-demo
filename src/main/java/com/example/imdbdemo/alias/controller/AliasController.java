package com.example.imdbdemo.alias.controller;

import com.example.imdbdemo.alias.dto.AliasDTO;
import com.example.imdbdemo.alias.service.AliasService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alias")
@RequiredArgsConstructor
public class AliasController {

	private final AliasService aliasService;

	@GetMapping
	public ResponseEntity<Page<AliasDTO>> search(Pageable pageable, @RequestParam MultiValueMap<String, String> params) {
		return ResponseEntity.ok(aliasService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<AliasDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(aliasService.findById(id));
	}
}
