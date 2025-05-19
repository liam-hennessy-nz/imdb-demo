package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_name_basics")
public class ImdbNameBasics {

	@Id
	@Column
	private String nconst;
	@Column
	private String primaryName;
	@Column
	private String birthYear;
	@Column
	private String deathYear;
	@Column
	private String primaryProfession;
	@Column
	private String knownForTitles;
}
