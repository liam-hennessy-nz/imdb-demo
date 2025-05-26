package com.example.imdbdemo.dtos.imdb;

import lombok.Data;

@Data
public class ImdbTitleAkaDTO {
	private Long id;
	private String tconst;
	private String ordering;
	private String title;
	private String region;
	private String language;
	private String types;
	private String attributes;
	private String isOriginalTitle;
}
