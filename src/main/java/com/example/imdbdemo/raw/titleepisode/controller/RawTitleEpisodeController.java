package com.example.imdbdemo.raw.titleepisode.controller;

import com.example.imdbdemo.raw.titleepisode.dto.RawTitleEpisodeDTO;
import com.example.imdbdemo.raw.titleepisode.service.RawTitleEpisodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/raw/title_episode")
@RequiredArgsConstructor
public class RawTitleEpisodeController {

	private final RawTitleEpisodeService rawTitleEpisodeService;

	@GetMapping
	public ResponseEntity<Page<RawTitleEpisodeDTO>> search(
		Pageable pageable,
		@RequestParam MultiValueMap<String, String> params
	) {
		return ResponseEntity.ok(rawTitleEpisodeService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<RawTitleEpisodeDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(rawTitleEpisodeService.findById(id));
	}

	@GetMapping("/tconst/{tconst}")
	public ResponseEntity<RawTitleEpisodeDTO> findByTconst(@PathVariable String tconst) {
		return ResponseEntity.ok(rawTitleEpisodeService.findByTconst(tconst));
	}
}
