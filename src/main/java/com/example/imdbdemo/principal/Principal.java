package com.example.imdbdemo.principal;

import com.example.imdbdemo.category.Category;
import com.example.imdbdemo.name.Name;
import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "principals")
public class Principal {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private int ordering;
	@ManyToOne
	private Name name;
	@ManyToMany(mappedBy = "principals")
	private Set<Category> categories;
	@Column
	private String job;
	@Column
	private String characters;

	@OneToMany(mappedBy = "principal")
	private Set<Title> titles;
}
