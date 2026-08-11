package com.example.imdbdemo.person.dto;

import com.example.imdbdemo.profession.dto.ProfessionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonProfessionDTO {

	private Long personId;
	private ProfessionDTO professionDTO;
}
