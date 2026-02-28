package com.example.imdbdemo.websocket.upload;

import com.example.imdbdemo.shared.config.props.AppProps;
import com.example.imdbdemo.websocket.upload.dto.UploadChunkDTO;
import com.example.imdbdemo.websocket.upload.dto.UploadSessionDTO;
import com.example.imdbdemo.websocket.upload.dto.messages.incoming.IncomingMessageDTO;
import com.example.imdbdemo.websocket.upload.exception.UploadException;
import com.example.imdbdemo.websocket.upload.exception.UploadUnsupportedException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.DatabindException;
import tools.jackson.databind.ObjectMapper;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
public class UploadHelper {
	private static final Marker UPLOAD = MarkerFactory.getMarker("UPLOAD");

	private final JdbcTemplate jdbcTemplate;
	private final ObjectMapper objectMapper;
	private final AppProps appProps;

	public UploadHelper(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper, AppProps appProps) {
		this.jdbcTemplate = jdbcTemplate;
		this.objectMapper = objectMapper;
		this.appProps = appProps;
	}

	public void logInfo(@NonNull UUID uuid, @NonNull String message) {
		log.info(UPLOAD, "[%s] - %s".formatted(uuid, message));
	}

	public void logWarn(@NonNull UUID uuid, @NonNull String message) {
		log.warn(UPLOAD, "[%s] - %s".formatted(uuid, message));
	}

	public void logError(@NonNull UUID uuid, @NonNull String message, @NonNull Exception ex) {
		log.error(UPLOAD, "[%s] - %s".formatted(uuid, message), ex);
	}

	/**
	 * Method parses an IncomingMessage from a TextMessage.
	 *
	 * @param session The WebSocket session the TextMessage was received on.
	 * @param message The TextMessage to parse the IncomingMessage from.
	 * @return An {@link IncomingMessageDTO} containing message data.
	 * @throws UploadException if an IncomingMessage fails to be parsed from the TextMessage.
	 */
	public IncomingMessageDTO parseIncomingMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {
		UUID sessionUuid = UUID.fromString(session.getId());
		String payload = message.getPayload();

		IncomingMessageDTO incomingMessage;
		try {
			incomingMessage = objectMapper.readValue(payload, IncomingMessageDTO.class);
		} catch (DatabindException ex) {
			throw new UploadUnsupportedException(sessionUuid, "Text message is not a valid IncomingMessageDTO");
		} catch (JacksonException ex) {
			throw new UploadException(sessionUuid, "Mapping to IncomingMessageDTO failed", ex);
		}
		return incomingMessage;
	}

	/**
	 * Method parses an UploadChunk from a BinaryMessage.
	 *
	 * @param session The WebSocket session the BinaryMessage was received on.
	 * @param message The BinaryMessage to parse the UploadChunk from.
	 * @return An {@link UploadChunkDTO} containing the parsed chunk index and data.
	 * @throws UploadException if no data is found within the BinaryMessage.
	 */
	public UploadChunkDTO parseUploadChunk(@NonNull WebSocketSession session, @NonNull BinaryMessage message) {
		UUID sessionUuid = UUID.fromString(session.getId());
		int index = message.getPayload().getInt();
		byte[] data = new byte[message.getPayload().remaining()];
		message.getPayload().get(data);

		if (index < 0) {
			throw new UploadException(sessionUuid, "Binary message index segment is invalid");
		}
		if (data.length == 0) {
			throw new UploadUnsupportedException(sessionUuid, "Binary message data segment is empty");
		}

		return UploadChunkDTO.builder().index(index).data(data).build();
	}

	public Optional<Path> findUploadPath(@NonNull UUID uuid) {
		Path path = Path.of(appProps.ul().tempDir(), "%s.bin".formatted(uuid));
		return Files.exists(path) ? Optional.of(path) : Optional.empty();
	}

	public UploadSessionDTO generateNewUploadSession(Upload upload, FileChannel channel) {
		return UploadSessionDTO.builder().upload(upload).isWorkerRunning(new AtomicBoolean(false)).isEofReceived(new AtomicBoolean(false)).chunkQueue(new ArrayBlockingQueue<>(appProps.ul().queueSize())).fileChannel(channel).build();
	}

	public void copyFromFileToDatabase(@NonNull Path filePath, @NonNull String copySql) {
		try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
			PGConnection pgConn = conn.unwrap(PGConnection.class);
			CopyManager copyManager = pgConn.getCopyAPI();

			try (InputStream in = new BufferedInputStream(Files.newInputStream(filePath))) {
				copyManager.copyIn(copySql, in);
			}
		} catch (Exception ex) {
			throw new RuntimeException("Failed to stream file to database", ex);
		}
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
			case "name_basics" ->
				"imdb_name_basics (nconst, primary_name, birth_year, death_year, primary_profession, known_for_titles)";
			case "title_akas" ->
				"imdb_title_akas (tconst, ordering, title, region, language, types, attributes, is_original_title)";
			case "title_basics" ->
				"imdb_title_basics (tconst, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)";
			case "title_crew" -> "imdb_title_crews (tconst, directors, writers)";
			case "title_episode" -> "imdb_title_episodes (tconst, parent_tconst, season_number, episode_number)";
			case "title_principals" -> "imdb_title_principals (tconst, ordering, nconst, category, job, characters)";
			case "title_ratings" -> "imdb_title_ratings (tconst, average_rating, num_votes)";
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
	 * @param input   InputStream containing the data to be copied.
	 * @param copySql SQL query template the COPY operation will use.
	 */
	public void pipeInputStreamToCopy(InputStream input, String copySql) {
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
}
