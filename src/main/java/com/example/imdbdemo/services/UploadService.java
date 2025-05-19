package com.example.imdbdemo.services;

import com.example.imdbdemo.dtos.UploadResponseDTO;
import com.example.imdbdemo.entities.Alias;
import com.example.imdbdemo.entities.Attribute;
import com.example.imdbdemo.entities.Genre;
import com.example.imdbdemo.entities.Type;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
public class UploadService {

	private final TitleService titleService;
	private final DataSource dataSource;
	private final JdbcTemplate jdbcTemplate;

	public UploadService(TitleService titleService, DataSource dataSource, JdbcTemplate jdbcTemplate) {
		this.titleService = titleService;
		this.dataSource = dataSource;
		this.jdbcTemplate = jdbcTemplate;
	}

	public UploadResponseDTO uploadTitles(MultipartFile file) {
		/*validateFile(file);

		// Step 1: Stream the file as it uploads
		try (InputStream inputStream = file.getInputStream()) {
			// Step 2: Save the file to disk
			try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
				try (BufferedWriter writer = Files.newBufferedWriter(tempFile, StandardCharsets.UTF_8)) {
					String line;
					while ((line = reader.readLine()) != null) {
						writer.write(line);
						writer.newLine();
					}
				}
			}
			// Step 3: Copy rows into raw db table
			try (Connection conn = dataSource.getConnection()) {
				CopyManager copyManager = new CopyManager(conn.unwrap(BaseConnection.class));
				try (Reader reader = Files.newBufferedReader(tempFile, StandardCharsets.UTF_8)) {
					copyManager.copyIn("", reader);
				}
			}
			Files.deleteIfExists(tempFile);
			// Step 4: Normalise tConsts
			jdbcTemplate.update("""
				INSERT INTO t_consts (name)
				SELECT DISTINCT tconst FROM imdb_title_basics
				ON CONFLICT DO NOTHING
			""");
			// Step 5: Normalise genres
			jdbcTemplate.update("""
				WITH all_genres AS (
					SELECT UNNEST(STRING_TO_ARRAY(genres, ',')) AS genre,
					FROM imdb_title_basics
					WHERE genre IS NOT NULL AND genres != '\\N'
				)
				INSERT INTO genres (name)
				SELECT DISTINCT genre FROM all_genres
				ON CONFLICT DO NOTHING
			""");
			// Step 6: Normalise titles
			jdbcTemplate.update("""
				INSERT INTO titles (tconst_id, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes)
				SELECT *
				FROM imdb_title_basics itb
				JOIN t_const tc ON itb.tconst = tc.name
			""");
			// Step 7: Link titles to genres
			jdbcTemplate.update("""
				INSERT INTO genres_titles (genres_id, titles_id)
				SELECT *
				FROM imdb_title_basics itb
				JOIN t_consts tc ON itb.tconst = tc.name
				JOIN titles t ON itb.tconst = t.tconst,
					UNNEST(STRING_TO_ARRAY(itb.genres, ',')) AS genre_name
				JOIN genre g on g.name = genre_name
				WHERE itb.genres IS NOT NULL AND genres != '\\N'
			""");

		} catch (Exception e) {
			throw new RuntimeException(e);
		}*/

		return new UploadResponseDTO();

		/*try (InputStream inputStream = file.getInputStream()) {
			String copySql = """
				COPY TITLES (
					TCONST, END_YEAR, IS_ADULT, ORIGINAL_TITLE, PRIMARY_TITLE, RUNTIME_MINUTES, START_YEAR, TITLE_TYPE, CREW_ID, PRINCIPAL_ID
				)
				FROM STDIN WITH (
					FORMAT CSV,
					DELIMITER E'\\t',
					HEADER TRUE,
					NULL '\\\\N'
				)
				""";

			try (Connection conn = DriverManager.getConnection(envConstants.getDbUrl(), envConstants.getDbUser(), envConstants.getDbPass())) {
				PGConnection pgConnection = conn.unwrap(PGConnection.class);
				CopyManager copyManager = pgConnection.getCopyAPI();

				try (InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8)) {
					long rowsCopied = copyManager.copyIn(copySql, reader);
					log.info("Imported rows: {}", rowsCopied);
				}
			}
		} catch (Exception e) {
			throw new RuntimeException("Error importing TSV file", e);
		}




		try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			String line;
			List<Title> batch = new ArrayList<>();
			final int BATCH_SIZE = 100;

			// Skip first line headers
			reader.readLine();

			while ((line = reader.readLine()) != null) {
				String[] columns = line.split("\t");

				Title title = new Title();
				title.setTitleType(parseString(columns[1]));
				title.setPrimaryTitle(parseString(columns[2]));
				title.setOriginalTitle(parseString(columns[3]));
				title.setIsAdult(parseBoolean(columns[4]));
				title.setStartYear(parseYear(columns[5]));
				title.setEndYear(parseYear(columns[6]));
				title.setRuntimeMinutes(parseInteger(columns[7]));
				title.setGenres(parseGenres(columns[8]));

				batch.add(title);

				if (batch.size() >= BATCH_SIZE) {
					titleService.saveAll(batch);
					batch.clear();
				}
			}

			if (!CollectionUtils.isEmpty(batch)) {
				titleService.saveAll(batch);
			}

		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		return true;*/
	}

	public Boolean uploadAliases(MultipartFile file) {
		validateFile(file);

		try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			String line;
			while ((line = reader.readLine()) != null) {
				String[] columns = line.split("\t");

				Alias alias = new Alias();
				alias.setOrdering(parseInteger(columns[1]));
				alias.setTitle(parseString(columns[2]));
				alias.setRegion(parseString(columns[3]));
				alias.setLanguage(parseString(columns[4]));
				alias.setTypes(parseTypes(columns[5]));
				alias.setAttributes(parseAttributes(columns[6]));
				alias.setIsOriginalTitle(parseBoolean(columns[7]));

			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		return true;
	}


	private Set<Genre> parseGenres(String genres) {
		Set<Genre> genresSet = new HashSet<>();

		for (String genreStr : genres.split(",")) {
			Genre genre = new Genre();
			genre.setName(genreStr);
			genresSet.add(genre);
		}

		return genresSet;
	}

	private Set<Type> parseTypes(String types) {
		Set<Type> typesSet = new HashSet<>();

		for (String typeStr : types.split(",")) {
			Type type = new Type();
			type.setName(typeStr);
			typesSet.add(type);
		}

		return typesSet;
	}

	private Set<Attribute> parseAttributes(String attributes) {
		Set<Attribute> attributeSet = new HashSet<>();

		for (String attributeStr : attributes.split(",")) {
			Attribute attribute = new Attribute();
			attribute.setName(attributeStr);
			attributeSet.add(attribute);
		}

		return attributeSet;
	}

	private String parseString(String string) {
		if (StringUtils.isBlank(string) || "\\N".equals(string)) {
			return null;
		}

		return string;
	}

	private Boolean parseBoolean(String bool) {
		if (StringUtils.isBlank(bool) || "\\N".equals(bool)) {
			return null;
		}

		if ("1".equals(bool)) {
			return true;
		} else if ("0".equals(bool)) {
			return false;
		} else {
			return null;
		}
	}

	private Year parseYear(String year) {
		if (StringUtils.isBlank(year) || "\\N".equals(year)) {
			return null;
		}

		try {
			return Year.of(Integer.parseInt(year));
		} catch (Exception e) {
			log.error("Invalid year: {}", e.getMessage());
		}

		return null;
	}

	private Integer parseInteger(String integer) {
		if (StringUtils.isBlank(integer) || "\\N".equals(integer)) {
			return null;
		}

		try {
			return Integer.parseInt(integer);
		} catch (Exception e) {
			log.error("Invalid integer: {}", e.getMessage());
		}

		return null;
	}

	private void validateFile(MultipartFile file) {
		if (file.isEmpty()) {
			throw new IllegalArgumentException("File is empty");
		}
	}
}
