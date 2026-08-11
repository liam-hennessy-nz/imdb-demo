package com.example.imdbdemo.migration;

public class ClearQueryConstants {

	// language=PostgreSQL
	private static final String CLEAR_RAW_NAME_BASIC = """
		-- noinspection SqlWithoutWhere
		DELETE FROM raw_name_basic;
		""";
	// language=PostgreSQL
	private static final String CLEAR_RAW_TITLE_AKA = """
		-- noinspection SqlWithoutWhere
		DELETE FROM raw_title_aka;
		""";
	// language=PostgreSQL
	private static final String CLEAR_RAW_TITLE_BASIC = """
		-- noinspection SqlWithoutWhere
		DELETE FROM raw_title_basic;
		""";
	// language=PostgreSQL
	private static final String CLEAR_RAW_TITLE_EPISODE = """
		-- noinspection SqlWithoutWhere
		DELETE FROM raw_title_episode;
		""";
	// language=PostgreSQL
	private static final String CLEAR_RAW_TITLE_PRINCIPAL = """
		-- noinspection SqlWithoutWhere
		DELETE FROM raw_title_principal;
		""";
	// language=PostgreSQL
	private static final String CLEAR_RAW_TITLE_RATING = """
		-- noinspection SqlWithoutWhere
		DELETE FROM raw_title_rating;
		""";
}
