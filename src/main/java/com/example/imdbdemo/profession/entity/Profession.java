package com.example.imdbdemo.profession.entity;

import com.example.imdbdemo.person.entity.Person;
import com.example.imdbdemo.principal.Principal;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class Profession {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	private Principal principal;

	@ManyToMany(mappedBy = "profession")
	private Set<Person> person;

	@Column(unique = true, nullable = false)
	private String name;
}
