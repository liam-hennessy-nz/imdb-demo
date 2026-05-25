package com.example.imdbdemo.title;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/title")
public class TitleController {

	private final TitleService titleService;

	public TitleController(TitleService titleService) {
		this.titleService = titleService;
	}

	@GetMapping("/")
	public ResponseEntity<List<Title>> findAll() {
		return ResponseEntity.ok(titleService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Title> findById(@PathVariable Long id) {
		return ResponseEntity.ok(titleService.findById(id));
	}
}
