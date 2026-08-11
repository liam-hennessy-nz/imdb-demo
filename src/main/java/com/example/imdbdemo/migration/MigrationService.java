package com.example.imdbdemo.migration;

import com.example.imdbdemo.migration.exception.MigrationNormaliseException;
import com.example.imdbdemo.migration.exception.MigrationStageException;
import com.example.imdbdemo.shared.constant.DatasetEnum;
import com.example.imdbdemo.shared.constant.TableEnum;
import com.example.imdbdemo.upload.service.UploadHelper;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MigrationService {

	private final UploadHelper uploadHelper;
	private final JdbcTemplate jdbcTemplate;

	public void migrate(@NonNull MigrationSqlEnum migrationSqlEnum, @NonNull UUID uuid, @NonNull Path filePath)
		throws SQLException {
		DatasetEnum dataset = migrationSqlEnum.getDataset();
		String stageSql = migrationSqlEnum.getStageSql();
		Map<TableEnum, String> normaliseSql = migrationSqlEnum.getNormaliseSql();

		try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
			conn.setAutoCommit(false);

			// Stage dataset
			uploadHelper.logInfo(uuid, "Beginning stage of '%s' dataset...".formatted(dataset));
			try {
				PGConnection pgConn = conn.unwrap(PGConnection.class);
				CopyManager copyManager = pgConn.getCopyAPI();

				try (InputStream in = new BufferedInputStream(Files.newInputStream(filePath))) {
					copyManager.copyIn(stageSql, in);
					conn.commit();
				}
			} catch (Exception ex) {
				conn.rollback();
				throw new MigrationStageException(uuid, dataset, ex);
			}
			uploadHelper.logInfo(uuid, "Successfully staged '%s' dataset".formatted(dataset));

			// Iterate over normalisations
			for (Map.Entry<TableEnum, String> entry : normaliseSql.entrySet()) {
				TableEnum table = entry.getKey();
				String sql = entry.getValue();

				uploadHelper.logInfo(uuid, "Beginning normalise of '%s' table...".formatted(table));
				try (PreparedStatement ps = conn.prepareStatement(sql)) {
					ps.executeUpdate();
					conn.commit();
				} catch (Exception e) {
					conn.rollback();
					throw new MigrationNormaliseException(uuid, table, e);
				}
				uploadHelper.logInfo(uuid, "Successfully normalised '%s' table".formatted(table));
			}
		}
	}
}
