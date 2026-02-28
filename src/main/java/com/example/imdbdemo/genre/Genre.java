package com.example.imdbdemo.genre;

import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "genres", uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class Genre {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String name;

	@ManyToMany
	@JoinTable(name = "genre_titles")
	private Set<Title> titles;
}
