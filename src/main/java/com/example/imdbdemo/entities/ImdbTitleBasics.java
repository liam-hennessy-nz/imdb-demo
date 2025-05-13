package com.example.imdbdemo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_basics")
public class ImdbTitleBasics {

	@Id
	@Column
	private String tconst;
	@Column
	private String titleType;
	@Column
	private String primaryTitle;
	@Column
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
