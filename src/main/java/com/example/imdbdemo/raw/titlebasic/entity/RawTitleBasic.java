package com.example.imdbdemo.raw.titlebasic.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class RawTitleBasic {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
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
