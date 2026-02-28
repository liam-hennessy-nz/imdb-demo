package com.example.imdbdemo.title;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TitleService {

	private final TitleRepository titleRepository;

	public TitleService(TitleRepository titleRepository) {
		this.titleRepository = titleRepository;
	}

	public List<Title> findAll() {
		return titleRepository.findAll();
	}

	public Title findById(Long id) {
		return titleRepository.findById(id).orElseThrow(
			() -> new TitleNotFoundException("Car with ID [%d] not found".formatted(id))
		);
	}

	public void save(Title title) {
		titleRepository.save(title);
	}

	public void saveAll(List<Title> titles) {
		titleRepository.saveAll(titles);
	}
}
