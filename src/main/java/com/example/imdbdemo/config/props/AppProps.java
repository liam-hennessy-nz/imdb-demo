package com.example.imdbdemo.config.props;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "imdb-demo")
public record AppProps (
	@NotBlank String host,
	@Min(1024) @Max(65535) int port,
	@NotNull boolean useTls,
	@Valid DbProps db,
	@Valid KsProps ks,
	@Valid WsProps ws
) {
	public record DbProps (
		@NotBlank String host,
		@Min(1024) @Max(65535) int port,
		@NotBlank String name,
		@NotBlank String user,
		@NotBlank String pass
	) {}

	public record KsProps (
		@NotBlank String path,
		@NotBlank String type,
		@NotBlank String alias,
		@NotBlank String pass
	) {}

	public record WsProps (
		@Min(1) @Max(2097152) int chunkSize
	) {}
}
