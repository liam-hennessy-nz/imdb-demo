package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_episode")
public class ImdbTitleEpisode {

	@Id
	@Column
	private String tconst;
	@Column
	private String parentTconst;
	@Column
	private String seasonNumber;
	@Column
	private String episodeNumber;
}
