package com.example.imdbdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Year;
import java.util.Set;

@Data
@Entity
@Table(name = "titles")
public class Title {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@OneToOne(mappedBy = "title")
	private tconstMap tconstMap;
	@Column
	private String titleType;
	@Column(length = 512)
	private String primaryTitle;
	@Column(length = 512)
	private String originalTitle;
	@Column
	private Boolean isAdult;
	@Column
	private Year startYear;
	@Column
	private Year endYear;
	@Column
	private Integer runtimeMinutes;
	@ManyToMany(mappedBy = "titles")
	private Set<Genre> genres;

	@OneToMany(mappedBy = "parentTitle")
	private Set<Alias> aliases;
	@ManyToOne
	private Crew crew;
	@OneToMany(mappedBy = "parentTitle")
	private Set<Episode> episodes;
	@ManyToOne
	private Principal principal;
	@ManyToMany(mappedBy = "titles")
	private Set<Rating> ratings;
	@ManyToMany
	private Set<Name> names;
}
