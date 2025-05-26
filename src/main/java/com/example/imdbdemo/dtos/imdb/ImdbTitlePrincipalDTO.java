package com.example.imdbdemo.dtos.imdb;

import lombok.Data;

@Data
public class ImdbTitlePrincipalDTO {
	private Long id;
	private String tconst;
	private String ordering;
	private String nconst;
	private String category;
	private String job;
	private String characters;
}
