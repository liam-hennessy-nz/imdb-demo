package com.example.imdbdemo.raw.dto;

import lombok.Data;

@Data
public class ImdbTitleEpisodeDTO {
	private Long id;
	private String tconst;
	private String parentTconst;
	private String seasonNumber;
	private String episodeNumber;
}
