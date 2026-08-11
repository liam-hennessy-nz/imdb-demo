package com.example.imdbdemo.migration.exception;

import com.example.imdbdemo.shared.constant.DatasetEnum;
import com.example.imdbdemo.websocket.exception.WebSocketException;
import java.util.UUID;
import lombok.Getter;

@Getter
public class MigrationStageException extends WebSocketException {

	private static final String MESSAGE = "Failed to stage '%s' dataset";

	public MigrationStageException(UUID uuid, DatasetEnum dataset) {
		super(uuid, MESSAGE.formatted(dataset.getValue()));
	}

	public MigrationStageException(UUID uuid, DatasetEnum dataset, Throwable cause) {
		super(uuid, MESSAGE.formatted(dataset.getValue()), cause);
	}
}
