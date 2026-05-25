package com.example.imdbdemo.raw.titleepisode.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_episodes")
public class RawTitleEpisode {
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
