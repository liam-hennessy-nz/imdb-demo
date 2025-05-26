package com.example.imdbdemo.dtos.imdb;

import lombok.Data;

@Data
public class ImdbTitleRatingDTO {
	private Long id;
	private String tconst;
	private String averageRating;
	private String numVotes;
}
