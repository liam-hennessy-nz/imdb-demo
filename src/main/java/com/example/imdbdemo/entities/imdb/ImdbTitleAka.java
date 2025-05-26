package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_akas")
public class ImdbTitleAka {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;
	@Column
	private String ordering;
	@Column(length = 1024)
	private String title;
	@Column
	private String region;
	@Column
	private String language;
	@Column
	private String types;
	@Column
	private String attributes;
	@Column
	private String isOriginalTitle;
}
