package com.example.imdbdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "crews")
public class Crew {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToMany(mappedBy = "crews")
	private Set<Name> directors;
	@ManyToMany(mappedBy = "crews")
	private Set<Name> writers;

	@OneToMany(mappedBy = "crew")
	private Set<Title> titles;
}
