package com.example.imdbdemo.raw.titleaka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RawTitleAkaDTO {
	private Long id;
	private String tconst;
	private String ordering;
	private String title;
	private String region;
	private String language;
	private String types;
	private String attributes;
	private String isOriginalTitle;
}
