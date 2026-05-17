package com.example.imdbdemo.raw.titlebasic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawTitleBasicDTO {
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
