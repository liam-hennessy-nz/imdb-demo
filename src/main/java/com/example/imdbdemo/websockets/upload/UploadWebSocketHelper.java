package com.example.imdbdemo.websockets.upload;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import java.io.InputStream;
import java.sql.Connection;
import java.util.Objects;

@Slf4j
@Component
public class UploadWebSocketHelper {

	private final JdbcTemplate jdbcTemplate;

	public UploadWebSocketHelper(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Method for determining the correct SQL query template from a filename.
	 *
	 * @param fileName Filename which will be used to determine the correct template.
	 * @return The matching COPY SQL query template.
	 */
	public String determineCopySql(String fileName) {
		if (StringUtils.isBlank(fileName)) {
			return null;
		}

		String copyBody = switch (fileName) {
			case "name.basics.tsv" ->
				"imdb_name_basics (nconst, primary_name, birth_year, death_year, primary_profession, known_for_titles)";
			case "title.akas.tsv" ->
				"imdb_title_akas (tconst, ordering, title, region, language, types, attributes, is_original_title)";
			case "title.basics.tsv" ->
				"imdb_title_basics (tconst, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)";
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

	/**
	 * Method for piping an InputStream into a PostgreSQL COPY operation. PostgreSQL will only finalise the entries in the
	 * database once the InputStream is closed. If InputStream is not closed gracefully, the COPY will be cancelled. This
	 * will usually occur if the related OutputStream is closed (such as when the WebSocket connection is terminated
	 * prematurely).
	 *
	 * @param copySql SQL query template the COPY operation will use.
	 * @param input   InputStream containing the data to be copied.
	 */
	public void pipeInputStreamToCopy(String copySql, InputStream input) {
		// Attempt to create new JDBC connection
		try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
			// Unwrap connection to PostgreSQL connection
			PGConnection pgConn = conn.unwrap(PGConnection.class);
			// Initialise CopyManager
			CopyManager copyManager = pgConn.getCopyAPI();
			// Begin awaiting on InputStream for new data, appending each operation to bulk COPY
			copyManager.copyIn(copySql, input);
		} catch (Exception e) {
			throw new RuntimeException("An error occurred while copying from input stream", e);
		}
	}

	/**
	 * Helper method for gracefully closing a WebSocket session.
	 *
	 * @param session The session to close.
	 * @param status  The status to close the session with.
	 */
	public void closeConnection(WebSocketSession session, CloseStatus status) {
		try {
			session.close(status);
		} catch (Exception e) {
			throw new RuntimeException("Failed to close WebSocket connection", e);
		}

		String msg = "WebSocket [%s] - Closing connection%s".formatted(
			session.getId(),
			status.getReason() == null ? "" : ": %s".formatted(status.getReason())
		);
		log.info(msg);
	}
}
