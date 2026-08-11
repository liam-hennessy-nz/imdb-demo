package com.example.imdbdemo.migration;

import static com.example.imdbdemo.migration.NormaliseQueryConstants.*;
import static com.example.imdbdemo.migration.StageQueryConstants.*;

import com.example.imdbdemo.shared.constant.DatasetEnum;
import com.example.imdbdemo.shared.constant.TableEnum;
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MigrationSqlEnum {
	RAW_NAME_BASIC(DatasetEnum.RAW_NAME_BASIC, STAGE_RAW_NAME_BASIC, NORMALISE_RAW_NAME_BASIC),
	RAW_TITLE_AKA(DatasetEnum.RAW_TITLE_AKA, STAGE_RAW_TITLE_AKA, NORMALISE_RAW_TITLE_AKA),
	RAW_TITLE_BASIC(DatasetEnum.RAW_TITLE_BASIC, STAGE_RAW_TITLE_BASIC, NORMALISE_RAW_TITLE_BASIC),
	RAW_TITLE_EPISODE(DatasetEnum.RAW_TITLE_EPISODE, STAGE_RAW_TITLE_EPISODE, NORMALISE_RAW_TITLE_EPISODE),
	RAW_TITLE_PRINCIPAL(DatasetEnum.RAW_TITLE_PRINCIPAL, STAGE_RAW_TITLE_PRINCIPAL, NORMALISE_RAW_TITLE_PRINCIPAL),
	RAW_TITLE_RATING(DatasetEnum.RAW_TITLE_RATING, STAGE_RAW_TITLE_RATING, NORMALISE_RAW_TITLE_RATING);

	private final DatasetEnum dataset;
	private final String stageSql;
	private final Map<TableEnum, String> normaliseSql;

	private static final Map<DatasetEnum, MigrationSqlEnum> FROM_DATASET = Arrays.stream(
		MigrationSqlEnum.values()
	).collect(Collectors.toMap(MigrationSqlEnum::getDataset, Function.identity()));

	public static MigrationSqlEnum getByDataset(DatasetEnum table) {
		return FROM_DATASET.get(table);
	}
}
