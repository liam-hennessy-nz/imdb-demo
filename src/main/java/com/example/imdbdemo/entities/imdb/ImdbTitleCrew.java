package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_crews")
public class ImdbTitleCrew {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;
	@Column(length = 16384)
	private String directors;
	@Column(length = 16384)
	private String writers;
}
