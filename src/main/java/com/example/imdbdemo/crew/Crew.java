package com.example.imdbdemo.crew;

import com.example.imdbdemo.name.Name;
import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Data
@Entity
@Table(name = "crews")
public class Crew {

	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToMany(mappedBy = "crews")
	private Set<Name> directors;

	@ManyToMany(mappedBy = "crews")
	private Set<Name> writers;

	@OneToMany(mappedBy = "crew")
	private Set<Title> titles;
}
