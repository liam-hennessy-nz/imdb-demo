package com.example.imdbdemo.config.props;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "imdb-demo.db")
@Validated
public record DatabaseProps (

	@NotBlank String host,
	@NotNull @Min(1) @Max(65535) int port,
	@NotBlank String name,
	@NotBlank String user,
	@NotBlank String pass
) {}