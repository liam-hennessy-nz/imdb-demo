package com.example.imdbdemo.migration;

import org.springframework.stereotype.Component;

@Component
public class StageQueryConstants {

	// language=PostgreSQL
	public static final String STAGE_RAW_NAME_BASIC = """
		COPY raw_name_basic (
			nconst,
			primary_name,
			birth_year,
			death_year,
			primary_profession,
			known_for_titles
		)
		FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')
		""";

	// language=PostgreSQL
	public static final String STAGE_RAW_TITLE_AKA = """
		COPY raw_title_aka (
			tconst,
			ordering,
			title,
			region,
			language,
			types,
			attributes,
			is_original_title
		)
		FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')
		""";

	// language=PostgreSQL
	public static final String STAGE_RAW_TITLE_BASIC = """
		COPY raw_title_basic (
			tconst,
			title_type,
		  primary_title,
		  original_title,
			is_adult,
			start_year,
			end_year,
			runtime_minutes,
			genres
		)
		FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')
		""";

	// language=PostgreSQL
	public static final String STAGE_RAW_TITLE_EPISODE = """
		COPY raw_title_episode (
			tconst,
			parent_tconst,
			season_number,
			episode_number
		)
		FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')
		""";

	// language=PostgreSQL
	public static final String STAGE_RAW_TITLE_PRINCIPAL = """
		COPY raw_title_principal (
			tconst,
			ordering,
			nconst,
			category,
			job,
			characters
		)
		FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')
		""";

	// language=PostgreSQL
	public static final String STAGE_RAW_TITLE_RATING = """
		COPY raw_title_rating (
			tconst,
			average_rating,
			num_votes
		)
		FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')
		""";
}
