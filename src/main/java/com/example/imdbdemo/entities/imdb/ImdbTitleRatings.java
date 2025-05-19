package com.example.imdbdemo.entities.imdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "imdb_title_ratings")
public class ImdbTitleRatings {

	@Id
	@Column
	private String tconst;
	@Column
	private String averageRating;
	@Column
	private String numVotes;
}
