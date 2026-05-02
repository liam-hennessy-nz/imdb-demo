import { RAW_NAME_BASIC_CONFIG, type RawNameBasic } from '../../raw/entity/RawNameBasic.ts';
import { RAW_TITLE_AKA_CONFIG, type RawTitleAka } from '../../raw/entity/RawTitleAka.ts';
import { RAW_TITLE_BASIC_CONFIG, type RawTitleBasic } from '../../raw/entity/RawTitleBasic.ts';
import { RAW_TITLE_CREW_CONFIG, type RawTitleCrew } from '../../raw/entity/RawTitleCrew.ts';
import { RAW_TITLE_EPISODE_CONFIG, type RawTitleEpisode } from '../../raw/entity/RawTitleEpisode.ts';
import { RAW_TITLE_PRINCIPAL_CONFIG, type RawTitlePrincipal } from '../../raw/entity/RawTitlePrincipal.ts';
import { RAW_TITLE_RATING_CONFIG, type RawTitleRating } from '../../raw/entity/RawTitleRating.ts';

export interface DatasetMap {
	rawNameBasic: RawNameBasic;
	rawTitleAka: RawTitleAka;
	rawTitleBasic: RawTitleBasic;
	rawTitleCrew: RawTitleCrew;
	rawTitleEpisode: RawTitleEpisode;
	rawTitlePrincipal: RawTitlePrincipal;
	rawTitleRating: RawTitleRating;
}

export type DatasetKey = keyof DatasetMap;
export type Datasets = DatasetMap[DatasetKey];

export const DATASET_CONFIGS: Record<DatasetKey, DatasetConfig<Datasets>> = {
	rawNameBasic: RAW_NAME_BASIC_CONFIG,
	rawTitleAka: RAW_TITLE_AKA_CONFIG,
	rawTitleBasic: RAW_TITLE_BASIC_CONFIG,
	rawTitleCrew: RAW_TITLE_CREW_CONFIG,
	rawTitleEpisode: RAW_TITLE_EPISODE_CONFIG,
	rawTitlePrincipal: RAW_TITLE_PRINCIPAL_CONFIG,
	rawTitleRating: RAW_TITLE_RATING_CONFIG,
} as const satisfies Record<DatasetKey, DatasetConfig<Datasets>>;

interface KeyConfig {
	label: string;
	flex: number;
}

export interface DatasetConfig<T extends Datasets> {
	keys: Record<keyof T, KeyConfig>;
	file: string;
}
