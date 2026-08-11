package com.example.imdbdemo.alias.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AliasDTO {

	private Long id;
	private Short ordering;
	private String name;
	private String notes;

	@JsonProperty("isOriginal")
	private boolean isOriginal;
}
