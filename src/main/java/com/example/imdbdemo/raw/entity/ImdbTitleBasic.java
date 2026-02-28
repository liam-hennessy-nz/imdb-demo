package com.example.imdbdemo.raw.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_basics")
public class ImdbTitleBasic {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;
	@Column
	private String titleType;
	@Column(length = 512)
	private String primaryTitle;
	@Column(length = 512)
	private String originalTitle;
	@Column
	private String isAdult;
	@Column
	private String startYear;
	@Column
	private String endYear;
	@Column
	private String runtimeMinutes;
	@Column
	private String genres;
}
