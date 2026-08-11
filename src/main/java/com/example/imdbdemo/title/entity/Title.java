package com.example.imdbdemo.title.entity;

import com.example.imdbdemo.alias.entity.Alias;
import com.example.imdbdemo.genre.entity.Genre;
import com.example.imdbdemo.person.entity.Person;
import com.example.imdbdemo.principal.Principal;
import com.example.imdbdemo.rating.Rating;
import com.example.imdbdemo.title_episode.TitleEpisode;
import com.example.imdbdemo.title_type.TitleType;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class Title {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	private Rating rating;

	@OneToOne
	private TitleEpisode titleEpisode;

	@OneToMany(mappedBy = "title")
	private Set<Principal> principal;

	@OneToMany(mappedBy = "title")
	private Set<Alias> alias;

	@OneToMany(mappedBy = "parent")
	private Set<TitleEpisode> titleParent;

	@ManyToMany
	private Set<Genre> genre;

	@ManyToMany(mappedBy = "knownForTitle")
	private Set<Person> knownForPerson;

	@ManyToMany
	private Set<TitleType> titleType;

	@Column(unique = true, nullable = false)
	private String tconst;

	@Column(nullable = false)
	private boolean isAdult;

	@Column
	private Short startYear;

	@Column
	private Short endYear;

	@Column
	private Integer runtimeMinutes;
}
