package com.example.imdbdemo.rating;

import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Data
@Entity
@Table(name = "ratings")
public class Rating {

	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	private Double averageRating;

	@Column
	private int numVotes;

	@ManyToMany
	private Set<Title> titles;
}
