package com.example.imdbdemo.controllers.imdb;

import com.example.imdbdemo.dtos.PageRequestDTO;
import com.example.imdbdemo.dtos.imdb.ImdbNameBasicDTO;
import com.example.imdbdemo.services.imdb.ImdbNameBasicService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/imdb/name_basic")
public class ImdbNameBasicController {

	private final ImdbNameBasicService imdbNameBasicService;

	public ImdbNameBasicController(ImdbNameBasicService imdbNameBasicService) {
		this.imdbNameBasicService = imdbNameBasicService;
	}

	@GetMapping("/")
	public ResponseEntity<Page<ImdbNameBasicDTO>> findAll(Pageable pageable) {
		return ResponseEntity.ok(imdbNameBasicService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ImdbNameBasicDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(imdbNameBasicService.findById(id));
	}

	@GetMapping("/nconst/{nconst}")
	public ResponseEntity<ImdbNameBasicDTO> findByNconst(@PathVariable String nconst) {
		return ResponseEntity.ok(imdbNameBasicService.findByNconst(nconst));
	}

	@PostMapping("/filter")
	public ResponseEntity<Page<ImdbNameBasicDTO>> filter(@RequestBody PageRequestDTO pageRequestDTO) {
		return ResponseEntity.ok(imdbNameBasicService.filter(pageRequestDTO));
	}
}
