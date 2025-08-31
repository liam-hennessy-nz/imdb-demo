package com.example.imdbdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "aliases")
public class Alias {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private Integer ordering;
	@Column
	private String title;
	@Column
	private String region;
	@Column
	private String language;
	@ManyToMany(mappedBy = "aliases")
	private Set<Attribute> attributes;
	@Column
	private Boolean isOriginalTitle;

	@ManyToOne
	private Title parentTitle;
}
