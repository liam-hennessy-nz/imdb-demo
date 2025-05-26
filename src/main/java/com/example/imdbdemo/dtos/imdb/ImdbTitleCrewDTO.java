package com.example.imdbdemo.dtos.imdb;

import lombok.Data;

@Data
public class ImdbTitleCrewDTO {
	private Long id;
	private String tconst;
	private String directors;
	private String writers;
}
