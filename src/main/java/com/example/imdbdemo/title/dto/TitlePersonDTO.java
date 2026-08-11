package com.example.imdbdemo.title.dto;

import com.example.imdbdemo.person.dto.PersonDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TitlePersonDTO {

	private Long titleId;
	private PersonDTO personDTO;
}
