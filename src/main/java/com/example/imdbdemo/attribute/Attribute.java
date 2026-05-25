package com.example.imdbdemo.attribute;

import com.example.imdbdemo.alias.Alias;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Data
@Entity
@Table(name = "attributes")
public class Attribute {

	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	private String name;

	@ManyToMany
	private Set<Alias> aliases;
}
