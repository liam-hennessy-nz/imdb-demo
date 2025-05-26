package com.example.imdbdemo.dtos.imdb;

import lombok.Data;

@Data
public class ImdbTitleEpisodeDTO {
	private Long id;
	private String tconst;
	private String parentTconst;
	private String seasonNumber;
	private String episodeNumber;
}
