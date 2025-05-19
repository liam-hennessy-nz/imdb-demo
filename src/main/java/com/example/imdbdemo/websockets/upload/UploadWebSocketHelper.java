package com.example.imdbdemo.websockets.upload;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class UploadWebSocketHelper {

	public String determineCopySql(String fileName) {
		if (StringUtils.isBlank(fileName)) {
			return null;
		}

		String copyBody = switch (fileName) {
			case "name.basics.tsv" -> "imdb_name_basics (nconst, primary_name, birth_year, death_year, primary_profession, known_for_titles)";
			case "title.akas.tsv" -> "imdb_title_akas (tconst, ordering, title, region, language, types, attributes, is_original_title)";
			case "title.basics.tsv" -> "imdb_title_basics (tconst, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)";
			case "title.crew.tsv" -> "imdb_title_crew (tconst, directors, writers)";
			case "title.episode.tsv" -> "imdb_title_episode (tconst, parent_tconst, season_number, episode_number)";
			case "title.principals.tsv" -> "imdb_title_principals (tconst, ordering, nconst, category, job, characters)";
			case "title.ratings.tsv" -> "imdb_title_ratings (tconst, average_rating, num_votes)";
			default -> null;
		};

		if (copyBody == null) {
			return null;
		}

		return "COPY %s FROM STDIN WITH (FORMAT TEXT, DELIMITER E'\t', NULL '\\N')".formatted(copyBody);
	}
}
