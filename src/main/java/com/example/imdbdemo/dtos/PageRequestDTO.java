package com.example.imdbdemo.dtos;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class PageRequestDTO {
	private int page;
	private int size;
	private List<SortMetadata> sort;
	private Map<String, FilterMetadata> filter;

	@Data
	public static class SortMetadata {
		private String field;
		private Integer order;
	}

	@Data
	public static class FilterMetadata {
		private String operator;
		private List<FilterConstraint> constraints;
	}

	@Data
	public static class FilterConstraint {
		private String value;
		private String matchMode;
	}
}
