package com.example.imdbdemo.genre.controller;

import com.example.imdbdemo.genre.dto.GenreDTO;
import com.example.imdbdemo.genre.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
public class GenreController {

	private final GenreService genreService;

	@GetMapping
	public ResponseEntity<Page<GenreDTO>> search(Pageable pageable, @RequestParam MultiValueMap<String, String> params) {
		return ResponseEntity.ok(genreService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<GenreDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(genreService.findById(id));
	}
}
