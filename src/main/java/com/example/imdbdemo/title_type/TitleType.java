package com.example.imdbdemo.title_type;

import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;

@Entity
@Table
@Data
public class TitleType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToMany(mappedBy = "titleType")
	private Set<Title> title;

	@Column(unique = true, nullable = false)
	private String name;
}
