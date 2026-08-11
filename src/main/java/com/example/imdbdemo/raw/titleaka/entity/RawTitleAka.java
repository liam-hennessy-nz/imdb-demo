package com.example.imdbdemo.raw.titleaka.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class RawTitleAka {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
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
