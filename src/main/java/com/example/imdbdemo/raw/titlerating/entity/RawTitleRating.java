package com.example.imdbdemo.raw.titlerating.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class RawTitleRating {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id;

	@Column
	private String tconst;

	@Column
	private String averageRating;

	@Column
	private String numVotes;
}
