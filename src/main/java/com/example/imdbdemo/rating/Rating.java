package com.example.imdbdemo.rating;

import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class Rating {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(optional = false)
	private Title title;

	@Column
	private Short average;

	@Column
	private Integer count;
}
