package com.example.imdbdemo.shared.dto;

import lombok.Data;

import java.util.Map;

@Data
public class PageRequestDTO {
	private int page;
	private int size;
	private Map<String, Integer> sort;
	private Map<String, FilterConstraint> filter;

	@Data
	public static class FilterConstraint {
		private String value;
		private String matchMode;
	}
}
