package com.example.imdbdemo.person.dto;

import com.example.imdbdemo.title.dto.TitleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonTitleDTO {

	private Long personId;
	private TitleDTO titleDTO;
}
