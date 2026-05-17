package com.example.imdbdemo.raw.titlecrew.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawTitleCrewDTO {
	private Long id;
	private String tconst;
	private String directors;
	private String writers;
}
