package com.example.imdbdemo.title_episode;

import com.example.imdbdemo.title.entity.Title;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class TitleEpisode {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@MapsId
	private Title episode;

	@ManyToOne
	private Title parent;

	@Column
	private Integer seasonNumber;

	@Column
	private Integer episodeNumber;
}
