package com.example.imdbdemo.language;

import com.example.imdbdemo.alias.entity.Alias;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class Language {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToMany(mappedBy = "language")
	private Set<Alias> alias;

	@Column(unique = true, nullable = false)
	private String name;
}
