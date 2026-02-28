package com.example.imdbdemo.name;

import com.example.imdbdemo.crew.Crew;
import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Year;
import java.util.Set;

@Data
@Entity
@Table(name = "names")
public class Name {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String primaryName;
	@Column
	private Year birthYear;
	@Column
	private Year deathYear;
	@Column
	private String primaryProfession;
	@ManyToMany(mappedBy = "names")
	private Set<Title> knownForTitles;

	@ManyToMany
	private Set<Crew> crews;
}
