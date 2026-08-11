package com.example.imdbdemo.person.entity;

import com.example.imdbdemo.principal.Principal;
import com.example.imdbdemo.profession.entity.Profession;
import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class Person {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToMany
	private Set<Profession> profession;

	@ManyToMany
	private Set<Title> knownForTitle;

	@OneToMany(mappedBy = "person")
	private Set<Principal> principal;

	@Column(unique = true, nullable = false)
	private String nconst;

	@Column
	private String name;

	@Column
	private Short birthYear;

	@Column
	private Short deathYear;
}
