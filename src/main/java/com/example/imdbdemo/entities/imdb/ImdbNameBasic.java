package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_name_basics")
public class ImdbNameBasic {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
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
