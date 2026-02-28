package com.example.imdbdemo.shared.entity;

import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tconst_maps", uniqueConstraints = {@UniqueConstraint(columnNames = "tconst")})
public class TconstMap {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String tconst;

	@OneToOne
	private Title title;
}
