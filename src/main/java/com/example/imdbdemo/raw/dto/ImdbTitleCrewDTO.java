package com.example.imdbdemo.raw.dto;

import lombok.Data;

@Data
public class ImdbTitleCrewDTO {
	private Long id;
	private String tconst;
	private String directors;
	private String writers;
}
