package com.example.imdbdemo.genre.entity;

import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class Genre {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToMany(mappedBy = "genre")
	private Set<Title> title;

	@Column(unique = true, nullable = false)
	private String name;
}
