package com.example.imdbdemo.profession.controller;

import com.example.imdbdemo.profession.dto.ProfessionDTO;
import com.example.imdbdemo.profession.service.ProfessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profession")
@RequiredArgsConstructor
public class ProfessionController {

	private final ProfessionService professionService;

	@GetMapping
	public ResponseEntity<Page<ProfessionDTO>> search(
		Pageable pageable,
		@RequestParam MultiValueMap<String, String> params
	) {
		return ResponseEntity.ok(professionService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProfessionDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(professionService.findById(id));
	}
}
