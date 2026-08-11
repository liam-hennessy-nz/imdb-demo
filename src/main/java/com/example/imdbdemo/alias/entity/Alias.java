package com.example.imdbdemo.alias.entity;

import com.example.imdbdemo.aliastype.AliasType;
import com.example.imdbdemo.language.Language;
import com.example.imdbdemo.region.Region;
import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class Alias {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	private Title title;

	@ManyToMany
	private Set<AliasType> aliasType;

	@ManyToMany
	private Set<Language> language;

	@ManyToMany
	private Set<Region> region;

	@Column(nullable = false)
	private Short ordering;

	@Column(nullable = false, length = 1024)
	private String name;

	@Column
	private String notes;

	@Column(nullable = false)
	private boolean isOriginal;
}
