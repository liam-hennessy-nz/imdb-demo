package com.example.imdbdemo.raw.dto;

import lombok.Data;

@Data
public class ImdbTitleBasicDTO {
	private Long id;
	private String tconst;
	private String titleType;
	private String primaryTitle;
	private String originalTitle;
	private String isAdult;
	private String startYear;
	private String endYear;
	private String runtimeMinutes;
	private String genres;
}
