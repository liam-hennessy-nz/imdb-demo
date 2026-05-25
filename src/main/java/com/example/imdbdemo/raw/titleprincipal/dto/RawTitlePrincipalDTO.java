package com.example.imdbdemo.raw.titleprincipal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawTitlePrincipalDTO {
	private Long id;
	private String tconst;
	private String ordering;
	private String nconst;
	private String category;
	private String job;
	private String characters;
}
