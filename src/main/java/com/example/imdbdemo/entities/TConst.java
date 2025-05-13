package com.example.imdbdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "t_consts", uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class TConst {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String name;

	@OneToOne(mappedBy = "tConst")
	private Title title;
}
