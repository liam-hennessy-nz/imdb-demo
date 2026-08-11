package com.example.imdbdemo.title.dto;

import com.example.imdbdemo.person.dto.PersonDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TitleDTO {

	private Long id;
	private String tconst;

	@JsonProperty("isAdult")
	private boolean isAdult;

	private Short startYear;
	private Short endYear;
	private Integer runtimeMinutes;
	private List<PersonDTO> crew;
}
