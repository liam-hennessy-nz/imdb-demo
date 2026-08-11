package com.example.imdbdemo.raw.titleprincipal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class RawTitlePrincipal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
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
