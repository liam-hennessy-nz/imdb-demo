package com.example.imdbdemo.raw.titleepisode.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawTitleEpisodeDTO {
	private Long id;
	private String tconst;
	private String parentTconst;
	private String seasonNumber;
	private String episodeNumber;
}
