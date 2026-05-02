package com.example.imdbdemo.shared.dto;

import lombok.Data;

import java.util.List;

@Data
public class PageRequestDTO {
	private PaginationDTO pagination;
	private List<SortDTO> sort;
	private FilterDTO filter;

	@Data
	public static class PaginationDTO {
		private int page;
		private int pageSize;
	}

	@Data
	public static class SortDTO {
		private String field;
		private String sort;
	}

	@Data
	public static class FilterDTO {
		private List<FilterConstraintDTO> items;
	}

	@Data
	public static class FilterConstraintDTO {
		private String id;
		private String field;
		private String value;
		private String operator;
	}
}
