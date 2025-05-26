package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_episodes")
public class ImdbTitleEpisode {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;
	@Column
	private String parentTconst;
	@Column
	private String seasonNumber;
	@Column
	private String episodeNumber;
}
