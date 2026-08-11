package com.example.imdbdemo.raw.titleepisode.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class RawTitleEpisode {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
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
