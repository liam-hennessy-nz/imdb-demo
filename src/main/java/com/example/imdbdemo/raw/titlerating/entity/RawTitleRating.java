package com.example.imdbdemo.raw.titlerating.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_ratings")
public class RawTitleRating {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;
	@Column
	private String averageRating;
	@Column
	private String numVotes;
}
