package com.example.imdbdemo.character.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CharacterDTO {

	private Long id;
	private Short ordering;
	private String name;
}
