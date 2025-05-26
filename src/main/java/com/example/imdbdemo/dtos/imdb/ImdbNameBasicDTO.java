package com.example.imdbdemo.dtos.imdb;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImdbNameBasicDTO {
	private Long id;
	private String nconst;
	private String primaryName;
	private String birthYear;
	private String deathYear;
	private String primaryProfession;
	private String knownForTitles;
}
