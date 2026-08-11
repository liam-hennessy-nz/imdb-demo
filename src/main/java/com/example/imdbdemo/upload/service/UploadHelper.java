package com.example.imdbdemo.upload.service;

import com.example.imdbdemo.shared.config.props.AppProps;
import com.example.imdbdemo.upload.dto.messages.incoming.IncomingMessageDTO;
import com.example.imdbdemo.upload.entity.Upload;
import com.example.imdbdemo.upload.entity.UploadChunk;
import com.example.imdbdemo.upload.exception.UploadException;
import com.example.imdbdemo.upload.exception.UploadUnsupportedException;
import jakarta.validation.Validator;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.DatabindException;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@RequiredArgsConstructor
@Service
public class UploadHelper {

	private final JdbcTemplate jdbcTemplate;
	private final ObjectMapper objectMapper;
	private final AppProps appProps;

	private static final Marker UPLOAD = MarkerFactory.getMarker("UPLOAD");
	private final Validator validator;

	public void logTrace(@NonNull UUID uuid, @NonNull String message) {
		log.trace(UPLOAD, "[%s] - %s".formatted(uuid, message));
	}

	public void logDebug(@NonNull UUID uuid, @NonNull String message) {
		log.debug(UPLOAD, "[%s] - %s".formatted(uuid, message));
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
	 * Method parses an IncomingMessageDTO from a TextMessage.
	 *
	 * @param uploadSession The upload session the TextMessage was received on.
	 * @param message The TextMessage to parse the IncomingMessageDTO from.
	 * @return An {@link IncomingMessageDTO} containing message data.
	 * @throws UploadException if an IncomingMessageDTO fails to be parsed from the TextMessage.
	 */
	public IncomingMessageDTO parseIncomingMessage(@NonNull UploadSession uploadSession, @NonNull TextMessage message) {
		WebSocketSession session = uploadSession.getWebSocketSession();
		Upload upload = uploadSession.getUpload();
		UUID uuid = Objects.isNull(upload) ? UUID.fromString(session.getId()) : upload.getUuid();

		String payload = message.getPayload();
		try {
			return objectMapper.readValue(payload, IncomingMessageDTO.class);
		} catch (DatabindException ex) {
			throw new UploadUnsupportedException(uuid, "Text message is not a valid IncomingMessageDTO");
		} catch (JacksonException ex) {
			throw new UploadException(uuid, "Mapping to IncomingMessageDTO failed", ex);
		}
	}

	/**
	 * Method parses an UploadChunk from a BinaryMessage.
	 *
	 * @param upload The Upload which the BinaryMessage belongs to.
	 * @param message The BinaryMessage to parse the UploadChunk from.
	 * @return An {@link UploadChunk} containing the parsed chunk index and data.
	 * @throws UploadException if no data is found within the BinaryMessage.
	 */
	public UploadChunk parseUploadChunk(@NonNull Upload upload, @NonNull BinaryMessage message) {
		ByteBuffer payload = message.getPayload();

		// First four bytes are the chunk index
		int index = payload.getInt();
		// Remaining bytes are the chunk data
		byte[] data = new byte[payload.remaining()];
		payload.get(data);

		if (index < 0 || data.length == 0) {
			throw new UploadException(upload.getUuid(), "Binary message is invalid");
		}

		return UploadChunk.builder().index(index).data(data).build();
	}

	public Optional<Path> findUploadPath(@NonNull UUID uuid) {
		Path path = Path.of(appProps.ul().tempDir(), "%s.bin".formatted(uuid));
		return Files.exists(path) ? Optional.of(path) : Optional.empty();
	}
}
