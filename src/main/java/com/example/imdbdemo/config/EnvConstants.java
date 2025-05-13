package com.example.imdbdemo.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class EnvConstants {

	@Value("${DB_HOST}")
	private String dbHost;
	@Value("${DB_PORT}")
	private String dbPort;
	@Value("${DB_NAME}")
	private String dbName;
	@Value("${DB_USER}")
	private String dbUser;
	@Value("${DB_PASS}")
	private String dbPass;

	private final String dbUrl = "jdbc:postgresql://%s:%s/%s".formatted(dbHost, dbPort, dbName);
}
