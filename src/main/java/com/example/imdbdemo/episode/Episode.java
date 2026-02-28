package com.example.imdbdemo.episode;

import com.example.imdbdemo.title.Title;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "episodes")
public class Episode {
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	private Title parentTitle;
	@Column
	private int seasonNumber;
	@Column
	private int episodeNumber;
}
