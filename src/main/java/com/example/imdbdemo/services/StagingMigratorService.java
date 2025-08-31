package com.example.imdbdemo.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;

@Slf4j
@Service
public class StagingMigratorService {
	private final DataSource dataSource;
	private final StagingMigratorHelperService stagingMigratorHelperService;

	public StagingMigratorService(DataSource dataSource, StagingMigratorHelperService stagingMigratorHelperService) {
		this.dataSource = dataSource;
		this.stagingMigratorHelperService = stagingMigratorHelperService;
	}

	/**
	 * Method that gets the current data in imdb_title_basics and migrates it to the new schema, splitting genres and
	 * types into their respective new tables in the process.
	 */
	public void migrateTitleBasics() {
		log.info("Migrating imdb_title_basics table to new schema...");

		try (Connection conn = dataSource.getConnection()) {
			conn.setAutoCommit(false);
			// Attempt to migrate, rolling back if an exception is caught
			try {
				// Step 1: Migrate genres
				Map<String, Integer> genreIdMap = stagingMigratorHelperService.migrateGenres(conn);
				// Step 2: Migrate types
				Map<String, Integer> typeIdMap = stagingMigratorHelperService.migrateTypes(conn);
				// Step 3: Migrate titles and map respective genres/types to them
				stagingMigratorHelperService.migrateTitles(conn, genreIdMap, typeIdMap);

				conn.commit();
			} catch (Exception e) {
				conn.rollback();
				throw e;
			}
		} catch (Exception e) {
			log.error("Failed to migrate imdb_title_basics", e);
		}
	}

	public void migrateTitleEpisodes() {
		log.info("Migrating imdb_title_episodes table to new schema...");

		try (Connection conn = dataSource.getConnection()) {

		} catch (Exception e) {
			log.error("Failed to migrate imdb_title_episodes", e);
		}
	}

	public void migrateTitleAkas() {
		log.info("Migrating imdb_title_akas table to new schema...");

		try (Connection conn = dataSource.getConnection()) {

		} catch (Exception e) {
			log.error("Failed to migrate imdb_title_akas", e);
		}
	}

	public void migrateNameBasics() {
		log.info("Migrating imdb_name_basics table to new schema...");

		try (Connection conn = dataSource.getConnection()) {

		} catch (Exception e) {
			log.error("Failed to migrate imdb_name_basics", e);
		}
	}

	public void migrateTitlePrincipals() {
		log.info("Migrating imdb_title_principals table to new schema...");

		try (Connection conn = dataSource.getConnection()) {

		} catch (Exception e) {
			log.error("Failed to migrate imdb_title_principals", e);
		}
	}

	public void migrateTitleCrews() {
		log.info("Migrating imdb_title_crews table to new schema...");

		try (Connection conn = dataSource.getConnection()) {

		} catch (Exception e) {
			log.error("Failed to migrate imdb_title_crews", e);
		}
	}

	public void migrateTitleRatings() {
		log.info("Migrating imdb_title_ratings table to new schema...");

		try (Connection conn = dataSource.getConnection()) {

		} catch (Exception e) {
			log.error("Failed to migrate imdb_title_ratings", e);
		}
	}
}
