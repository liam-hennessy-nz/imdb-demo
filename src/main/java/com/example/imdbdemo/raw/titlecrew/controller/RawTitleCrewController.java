package com.example.imdbdemo.raw.titlecrew.controller;

import com.example.imdbdemo.raw.titlecrew.dto.RawTitleCrewDTO;
import com.example.imdbdemo.raw.titlecrew.service.RawTitleCrewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/raw/title_crew")
public class RawTitleCrewController {
	private final RawTitleCrewService rawTitleCrewService;

	@GetMapping
	public ResponseEntity<Page<RawTitleCrewDTO>> findAll(
		Pageable pageable, @RequestParam Map<String, String> params
	) {
		return ResponseEntity.ok(rawTitleCrewService.findAll(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawTitleCrewDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawTitleCrewService.findById(id));
	}

	@GetMapping("/tconst/{tconst}")
	public ResponseEntity<RawTitleCrewDTO> findByTconst(@PathVariable String tconst) {
		return ResponseEntity.ok(rawTitleCrewService.findByTconst(tconst));
	}
}
