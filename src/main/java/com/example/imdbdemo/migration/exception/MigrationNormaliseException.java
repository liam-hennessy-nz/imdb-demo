package com.example.imdbdemo.migration.exception;

import com.example.imdbdemo.shared.constant.TableEnum;
import com.example.imdbdemo.websocket.exception.WebSocketException;
import java.util.UUID;

public class MigrationNormaliseException extends WebSocketException {

	private static final String MESSAGE = "Failed to normalise '%s' table";

	public MigrationNormaliseException(UUID uuid, TableEnum table) {
		super(uuid, MESSAGE.formatted(table.getValue()));
	}

	public MigrationNormaliseException(UUID uuid, TableEnum table, Throwable cause) {
		super(uuid, MESSAGE.formatted(table.getValue()), cause);
	}
}
