package com.example.imdbdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "episodes")
public class Episode {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	private Title parentTitle;
	@Column
	private int seasonNumber;
	@Column
	private int episodeNumber;
}
