package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_crew")
public class ImdbTitleCrew {

	@Id
	@Column
	private String tconst;
	@Column(length = 16384)
	private String directors;
	@Column(length = 16384)
	private String writers;
}
