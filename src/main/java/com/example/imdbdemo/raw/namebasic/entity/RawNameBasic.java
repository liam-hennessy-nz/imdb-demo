package com.example.imdbdemo.raw.namebasic.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class RawNameBasic {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
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
