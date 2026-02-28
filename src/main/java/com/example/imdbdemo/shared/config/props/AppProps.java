package com.example.imdbdemo.shared.config.props;

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
	@NotNull String tempDir,
	@Valid DatabaseProps db,
	@Valid KeystoreProps ks,
	@Valid WebSocketProps ws,
	@Valid UploadProps ul
) {
	public record DatabaseProps (
		@NotBlank String host,
		@Min(1024) @Max(65535) int port,
		@NotBlank String name,
		@NotBlank String user,
		@NotBlank String pass
	) {}

	public record KeystoreProps (
		@NotBlank String path,
		@NotBlank String type,
		@NotBlank String alias,
		@NotBlank String pass
	) {}

	public record WebSocketProps (
		@Valid ChunkProps chunk
	) {
		public record ChunkProps (
			@Min(1) @Max(2097152) int byteSize,
			@Min(1) int ackInterval,
			@Min(1) int inFlightMax
		) {}
	}

	public record UploadProps (
		@NotBlank String tempDir,
		@Min(1) @Max(5000) int queueSize
	) {}
}
