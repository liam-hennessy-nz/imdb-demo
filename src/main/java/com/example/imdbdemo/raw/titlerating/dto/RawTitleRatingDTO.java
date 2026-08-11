package com.example.imdbdemo.raw.titlerating.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawTitleRatingDTO {

	private String tconst;
	private String averageRating;
	private String numVotes;
}
