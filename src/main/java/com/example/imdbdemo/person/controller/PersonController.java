package com.example.imdbdemo.person.controller;

import com.example.imdbdemo.person.dto.PersonDTO;
import com.example.imdbdemo.person.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
public class PersonController {

	private final PersonService personService;

	@GetMapping
	public ResponseEntity<Page<PersonDTO>> search(Pageable pageable, @RequestParam MultiValueMap<String, String> params) {
		return ResponseEntity.ok(personService.search(pageable, params));
	}

	@GetMapping("/{id}")
	public ResponseEntity<PersonDTO> findById(@PathVariable Long id) {
		return ResponseEntity.ok(personService.findById(id));
	}
}
