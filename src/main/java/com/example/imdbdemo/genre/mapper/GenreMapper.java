package com.example.imdbdemo.genre.mapper;

import com.example.imdbdemo.genre.dto.GenreDTO;
import com.example.imdbdemo.genre.entity.Genre;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class GenreMapper {

	public Genre mapToEntity(GenreDTO genreDTO) {
		Genre genre = new Genre();
		BeanUtils.copyProperties(genreDTO, genre);
		return genre;
	}

	public GenreDTO mapToDto(Genre genre) {
		GenreDTO genreDTO = new GenreDTO();
		BeanUtils.copyProperties(genre, genreDTO);
		return genreDTO;
	}

	public List<Genre> mapToEntityList(List<GenreDTO> genreDTOList) {
		return genreDTOList.stream().map(this::mapToEntity).toList();
	}

	public List<GenreDTO> mapToDtoList(List<Genre> genreList) {
		return genreList.stream().map(this::mapToDto).toList();
	}
}
