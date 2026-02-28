package com.example.imdbdemo.raw.dto;

import lombok.Data;

@Data
public class ImdbTitleRatingDTO {
	private Long id;
	private String tconst;
	private String averageRating;
	private String numVotes;
}
