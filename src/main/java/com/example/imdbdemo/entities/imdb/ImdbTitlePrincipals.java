package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_principals")
public class ImdbTitlePrincipals {

	@Id
	@Column
	private String tconst;
	@Column
	private String ordering;
	@Column
	private String nconst;
	@Column
	private String category;
	@Column
	private String job;
	@Column
	private String characters;
}
