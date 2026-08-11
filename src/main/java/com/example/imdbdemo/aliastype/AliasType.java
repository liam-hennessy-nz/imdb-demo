package com.example.imdbdemo.aliastype;

import com.example.imdbdemo.alias.entity.Alias;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class AliasType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToMany(mappedBy = "aliasType")
	private Set<Alias> alias;

	@Column(unique = true, nullable = false)
	private String name;
}
