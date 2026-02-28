package com.example.imdbdemo.type;

import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "types")
public class Type {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String name;

	@ManyToMany
	@JoinTable(name = "type_titles")
	private Set<Title> titles;
}
