package com.example.imdbdemo.person.dto;

import com.example.imdbdemo.profession.dto.ProfessionDTO;
import com.example.imdbdemo.title.dto.TitleDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDTO {

	private Long id;
	private String nconst;
	private String name;
	private Short birthYear;
	private Short deathYear;
	private List<TitleDTO> knownForTitles;
	private List<ProfessionDTO> knownForProfessions;

	public PersonDTO(Long id, String nconst, String name, Short birthYear, Short deathYear) {
		this(id, nconst, name, birthYear, deathYear, List.of(), List.of());
	}
}
