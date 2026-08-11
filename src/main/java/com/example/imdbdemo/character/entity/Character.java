package com.example.imdbdemo.character.entity;

import com.example.imdbdemo.principal.Principal;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class Character {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private Principal principal;

	@Column
	private Short ordering;

	@Column(unique = true, nullable = false)
	private String name;
}
