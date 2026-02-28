package com.example.imdbdemo.raw.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_principals")
public class ImdbTitlePrincipal {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;
	@Column
	private String ordering;
	@Column
	private String nconst;
	@Column
	private String category;
	@Column(length = 512)
	private String job;
	@Column(length = 512)
	private String characters;
}
