package com.example.imdbdemo.principal;

import com.example.imdbdemo.character.entity.Character;
import com.example.imdbdemo.person.entity.Person;
import com.example.imdbdemo.profession.entity.Profession;
import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = { "title_id", "ordering" }))
@Data
public class Principal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	private Profession profession;

	@ManyToOne(optional = false)
	private Person person;

	@ManyToOne(optional = false)
	private Title title;

	@OneToMany(mappedBy = "principal")
	private Set<Character> character;

	@Column
	private Short ordering;

	@Column
	private String notes;
}
