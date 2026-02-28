package com.example.imdbdemo.category;

import com.example.imdbdemo.principal.Principal;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "categories")
public class Category {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String name;

	@ManyToMany
	private Set<Principal> principals;
}
