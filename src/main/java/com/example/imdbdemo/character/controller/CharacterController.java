package com.example.imdbdemo.character.controller;

import com.example.imdbdemo.character.dto.CharacterDTO;
import com.example.imdbdemo.character.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/character")
@RequiredArgsConstructor
public class CharacterController {

	private final CharacterService characterService;

	@GetMapping
	public ResponseEntity<Page<CharacterDTO>> search(
		Pageable pageable,
		@RequestParam MultiValueMap<String, String> params
	) {
		return ResponseEntity.ok(characterService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<CharacterDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(characterService.findById(id));
	}
}
