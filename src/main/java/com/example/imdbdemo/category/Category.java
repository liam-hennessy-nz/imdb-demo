package com.example.imdbdemo.category;

import com.example.imdbdemo.principal.Principal;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

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
