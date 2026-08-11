package com.example.imdbdemo.migration.exception;

import com.example.imdbdemo.shared.constant.DatasetEnum;
import com.example.imdbdemo.websocket.exception.WebSocketException;
import java.util.UUID;
import lombok.Getter;

@Getter
public class MigrationException extends WebSocketException {

	private static final String MESSAGE = "Failed to migrate '%s' dataset";

	public MigrationException(UUID uuid, DatasetEnum dataset) {
		super(uuid, MESSAGE.formatted(dataset.getValue()));
	}

	public MigrationException(UUID uuid, DatasetEnum dataset, Throwable cause) {
		super(uuid, MESSAGE.formatted(dataset.getValue()), cause);
	}
}
