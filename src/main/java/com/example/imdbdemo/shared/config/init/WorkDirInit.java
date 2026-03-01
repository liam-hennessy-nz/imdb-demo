package com.example.imdbdemo.shared.config.init;

import com.example.imdbdemo.shared.config.props.AppProps;
import lombok.Data;
import lombok.NonNull;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;

@Data
@Component
public class WorkDirInit implements ApplicationRunner {
	private final AppProps appProps;

	@Override
	public void run(@NonNull ApplicationArguments args) throws Exception {
		Path uploadDir = Path.of(appProps.ul().tempDir());
		Files.createDirectories(uploadDir);

		if (!Files.isWritable(uploadDir)) {
			throw new IllegalStateException("WorkDir '%s' is not writable".formatted(uploadDir));
		}
	}
}
