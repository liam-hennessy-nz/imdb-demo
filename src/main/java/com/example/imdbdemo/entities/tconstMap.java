package com.example.imdbdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tconst_map", uniqueConstraints = {@UniqueConstraint(columnNames = "tconst")})
public class tconstMap {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;

	@OneToOne
	private Title title;
}
