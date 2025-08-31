package com.example.imdbdemo.services;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class StagingMigratorHelperService {

	/**
	 * Method for extracting unique genres from title_basics and putting them into the new schema.
	 * @param conn Connection to utilise when running queries.
	 * @return Map which contains the unique genres linked to their new IDs.
	 */
	public Map<String, Integer> migrateGenres(Connection conn) {
		Map<String, Integer> genreIdMap = new HashMap<>();

		try (
			ResultSet genreRs = conn.createStatement().executeQuery("""
				SELECT DISTINCT INITCAP(LOWER(TRIM(g))) AS genre
				FROM imdb_title_basics,
				     LATERAL UNNEST(string_to_array(genres, ',')) AS g
				WHERE genres IS NOT NULL
			""");
			ResultSet mapRs = conn.createStatement().executeQuery(
				"SELECT id, name FROM genres"
			);
			PreparedStatement genreInsert = conn.prepareStatement(
				"INSERT INTO genres (name) VALUES (?) ON CONFLICT DO NOTHING"
			)
		) {
			// Batch insert unique genres
			while (genreRs.next()) {
				genreInsert.setString(1, genreRs.getString("genre"));
				genreInsert.addBatch();
			}
			genreInsert.executeBatch();

			// Map newly inserted genres to their IDs
			while (mapRs.next()) {
				genreIdMap.put(mapRs.getString("name").toLowerCase(), mapRs.getInt("id"));
			}

		} catch (Exception e) {
			throw new RuntimeException("Failed to insert genres", e);
		}

		return genreIdMap;
	}

	/**
	 * Method for extracting unique types from title_basics and putting them into the new schema.
	 * @param conn Connection to utilise when running queries.
	 * @return Map which contains the unique types linked to their new IDs.
	 */
	public Map<String, Integer> migrateTypes(Connection conn) {
		Map<String, Integer> typeIdMap = new HashMap<>();

		try (
			ResultSet typeRs = conn.createStatement().executeQuery("""
				SELECT DISTINCT INITCAP(LOWER(TRIM(t))) AS type
				FROM imdb_title_basics,
				     LATERAL UNNEST(string_to_array(title_type, ',')) AS t
				WHERE title_type IS NOT NULL
			""");
			ResultSet mapRs = conn.createStatement().executeQuery(
				"SELECT id, name FROM types"
			);
			PreparedStatement typeInsert = conn.prepareStatement(
				"INSERT INTO types (name) VALUES (?) ON CONFLICT DO NOTHING"
			)
		) {
			// Batch insert unique types
			while (typeRs.next()) {
				typeInsert.setString(1, typeRs.getString("type"));
				typeInsert.addBatch();
			}
			typeInsert.executeBatch();

			// Map newly inserted types to their IDs
			while (mapRs.next()) {
				typeIdMap.put(mapRs.getString("name").toLowerCase(), mapRs.getInt("id"));
			}

		} catch (Exception e) {
			throw new RuntimeException("Failed to insert types", e);
		}

		return typeIdMap;
	}

	/**
	 * Method for extracting unique titles from title_basics and putting them into the new schema.
	 * @param conn Connection to utilise when running queries.
	 * @param genreIdMap Map containing genres and their IDs.
	 * @param typeIdMap Map containing types and their IDs.
	 * @return Map which contains the unique titles linked to their new IDs.
	 */
	public Map<String, Integer> migrateTitles(Connection conn, Map<String, Integer> genreIdMap, Map<String, Integer> typeIdMap) {
		Map<String, Integer> titleIdMap = new HashMap<>();

		try (
			ResultSet titleRs = conn.createStatement().executeQuery("""
				SELECT DISTINCT
					TRIM(tconst) AS tconst,
					TRIM(title_type) AS title_type,
					TRIM(primary_title) AS primary_title,
					TRIM(original_title) AS original_title,
					is_adult,
					NULLIF(TRIM(start_year), '')::int AS start_year,
					NULLIF(TRIM(end_year), '')::int AS end_year,
					NULLIF(TRIM(runtime_minutes), '')::int AS runtime_minutes,
					genres
				FROM imdb_title_basics
			""");
			PreparedStatement titleInsert = conn.prepareStatement(
				"INSERT INTO titles (primary_title, original_title, is_adult, start_year, end_year, runtime_minutes) VALUES (?, ?, ?, ?, ?, ?)",
				Statement.RETURN_GENERATED_KEYS
			);
			PreparedStatement genreTitlesInsert = conn.prepareStatement(
				"INSERT INTO genre_titles (genres_id, titles_id) VALUES (?, ?)"
			);
			PreparedStatement typeTitlesInsert = conn.prepareStatement(
				"INSERT INTO type_titles (types_id, titles_id) VALUES (?, ?)"
			)
		) {
			// Loop over each SELECT result
			while (titleRs.next()) {
				// Get columns (staging table)
				String tconst = titleRs.getString("tconst");
				String titleType = titleRs.getString("title_type");
				String primaryTitle = titleRs.getString("primary_title");
				String originalTitle = titleRs.getString("original_title");
				boolean isAdult = titleRs.getBoolean("is_adult");
				int startYear = titleRs.getInt("start_year");
				int endYear = titleRs.getInt("end_year");
				int runtimeMinutes = titleRs.getInt("runtime_minutes");
				String genres = titleRs.getString("genres");

				// Insert title
				titleInsert.setString(1, primaryTitle);
				titleInsert.setString(2, originalTitle);
				titleInsert.setBoolean(3, isAdult);
				titleInsert.setInt(4, startYear);
				titleInsert.setInt(5, endYear);
				titleInsert.setInt(6, runtimeMinutes);
				titleInsert.executeUpdate();

				ResultSet keys = titleInsert.getGeneratedKeys();
				keys.next();
				int titleId = keys.getInt(1);
				titleIdMap.put(tconst, titleId);

				// Insert genre titles
				if (StringUtils.isNotBlank(genres)) {
					for (String genre : genres.split(",")) {
						Integer genreId = genreIdMap.get(genre.trim().toLowerCase());
						if (genreId != null) {
							genreTitlesInsert.setInt(1, genreId);
							genreTitlesInsert.setInt(2, titleId);
							genreTitlesInsert.addBatch();
						}
					}
				}

				// Insert type titles
				Integer typeId = typeIdMap.get(titleType.toLowerCase());
				if (typeId != null) {
					typeTitlesInsert.setInt(1, typeId);
					typeTitlesInsert.setInt(2, titleId);
					typeTitlesInsert.addBatch();
				}
			}

			genreTitlesInsert.executeBatch();
			typeTitlesInsert.executeBatch();

		} catch (Exception e) {
			throw new RuntimeException("Failed to bulk insert titles", e);
		}

		return titleIdMap;
	}
}
