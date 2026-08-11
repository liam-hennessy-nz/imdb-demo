import type { GridColType } from '@mui/x-data-grid';
import type { AliasModel } from '../../alias/model/AliasModel.ts';
import type { CharacterModel } from '../../character/model/CharacterModel.ts';
import type { GenreModel } from '../../genre/model/GenreModel.ts';
import type { PersonModel } from '../../person/model/PersonModel.ts';
import type { ProfessionModel } from '../../profession/model/ProfessionModel.ts';
import { type RawNameBasic } from '../../raw/namebasic/entity/RawNameBasic.ts';
import { type RawTitleAka } from '../../raw/titleaka/entity/RawTitleAka.ts';
import { type RawTitleBasic } from '../../raw/titlebasic/entity/RawTitleBasic.ts';
import { type RawTitleEpisode } from '../../raw/titleepisode/entity/RawTitleEpisode.ts';
import { type RawTitlePrincipal } from '../../raw/titleprincipal/entity/RawTitlePrincipal.ts';
import { type RawTitleRating } from '../../raw/titlerating/entity/RawTitleRating.ts';
import type { TitleModel } from '../../title/model/TitleModel.ts';

export interface DatasetMap {
	rawNameBasic: RawNameBasic;
	rawTitleAka: RawTitleAka;
	rawTitleBasic: RawTitleBasic;
	rawTitleEpisode: RawTitleEpisode;
	rawTitlePrincipal: RawTitlePrincipal;
	rawTitleRating: RawTitleRating;

	alias: AliasModel;
	character: CharacterModel;
	genre: GenreModel;
	person: PersonModel;
	profession: ProfessionModel;
	title: TitleModel;
}

export type DatasetKey = keyof DatasetMap;
export type Dataset = DatasetMap[DatasetKey];

export interface KeyConfig {
	label: string;
	type: GridColType;
	flex: number;
	editable: boolean;
}

export interface DatasetConfig<T extends Dataset> {
	keys: Record<keyof T, KeyConfig>;
	file: string;
}

const RAW_NAME_BASIC_CONFIG: DatasetConfig<RawNameBasic> = {
	keys: {
		nconst: { label: 'NConst', type: 'string', flex: 2, editable: false },
		primaryName: { label: 'Primary Name', type: 'string', flex: 3, editable: true },
		birthYear: { label: 'Birth Year', type: 'string', flex: 2, editable: true },
		deathYear: { label: 'Death Year', type: 'string', flex: 2, editable: true },
		primaryProfession: { label: 'Primary Profession', type: 'longText', flex: 4, editable: true },
		knownForTitles: { label: 'Known For Titles', type: 'longText', flex: 4, editable: true },
	},
	file: 'name.basics.tsv',
} as const satisfies DatasetConfig<RawNameBasic>;

const RAW_TITLE_AKA_CONFIG: DatasetConfig<RawTitleAka> = {
	keys: {
		tconst: { label: 'TConst', type: 'string', flex: 2, editable: false },
		ordering: { label: 'Ordering', type: 'string', flex: 1, editable: true },
		title: { label: 'Title', type: 'longText', flex: 6, editable: true },
		region: { label: 'Region', type: 'string', flex: 1, editable: true },
		language: { label: 'Language', type: 'string', flex: 1, editable: true },
		types: { label: 'Types', type: 'string', flex: 1, editable: true },
		attributes: { label: 'Attributes', type: 'string', flex: 2, editable: true },
		isOriginalTitle: { label: 'Original Title?', type: 'string', flex: 1, editable: true },
	},
	file: 'title.akas.tsv',
} as const satisfies DatasetConfig<RawTitleAka>;

const RAW_TITLE_BASIC_CONFIG: DatasetConfig<RawTitleBasic> = {
	keys: {
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: false },
		titleType: { label: 'Title Type', type: 'string', flex: 1, editable: true },
		primaryTitle: { label: 'Primary Title', type: 'longText', flex: 3, editable: true },
		originalTitle: { label: 'Original Title', type: 'longText', flex: 3, editable: true },
		isAdult: { label: 'Adult?', type: 'string', flex: 1, editable: true },
		startYear: { label: 'Start Year', type: 'string', flex: 1, editable: true },
		endYear: { label: 'End Year', type: 'string', flex: 1, editable: true },
		runtimeMinutes: { label: 'Runtime (mins)', type: 'string', flex: 1, editable: true },
		genres: { label: 'Genre', type: 'string', flex: 1, editable: true },
	},
	file: 'title.basics.tsv',
} as const satisfies DatasetConfig<RawTitleBasic>;

const RAW_TITLE_EPISODE_CONFIG: DatasetConfig<RawTitleEpisode> = {
	keys: {
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: false },
		parentTconst: { label: 'Parent TConst', type: 'string', flex: 1, editable: false },
		seasonNumber: { label: 'Season Number', type: 'string', flex: 5, editable: true },
		episodeNumber: { label: 'Episode Number', type: 'string', flex: 5, editable: true },
	},
	file: 'title.episode.tsv',
} as const satisfies DatasetConfig<RawTitleEpisode>;

const RAW_TITLE_PRINCIPAL_CONFIG: DatasetConfig<RawTitlePrincipal> = {
	keys: {
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: false },
		ordering: { label: 'Ordering', type: 'string', flex: 1, editable: true },
		nconst: { label: 'NConst', type: 'string', flex: 1, editable: false },
		category: { label: 'Category', type: 'string', flex: 3, editable: true },
		job: { label: 'Job', type: 'string', flex: 3, editable: true },
		characters: { label: 'Characters', type: 'string', flex: 3, editable: true },
	},
	file: 'title.principals.tsv',
} as const satisfies DatasetConfig<RawTitlePrincipal>;

const RAW_TITLE_RATING_CONFIG: DatasetConfig<RawTitleRating> = {
	keys: {
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: false },
		averageRating: { label: 'Average Rating', type: 'string', flex: 5, editable: true },
		numVotes: { label: 'Number of Votes', type: 'string', flex: 5, editable: true },
	},
	file: 'title.ratings.tsv',
} as const satisfies DatasetConfig<RawTitleRating>;

const ALIAS_CONFIG: DatasetConfig<AliasModel> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		ordering: { label: 'Ordering', type: 'number', flex: 1, editable: false },
		name: { label: 'Name', type: 'string', flex: 5, editable: true },
		notes: { label: 'Notes', type: 'string', flex: 5, editable: true },
	},
	file: 'alias.tsv',
} as const satisfies DatasetConfig<AliasModel>;

const CHARACTER_CONFIG: DatasetConfig<CharacterModel> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		ordering: { label: 'Ordering', type: 'number', flex: 1, editable: false },
		name: { label: 'Name', type: 'string', flex: 10, editable: true },
	},
	file: 'character.tsv',
} as const satisfies DatasetConfig<CharacterModel>;

const GENRE_CONFIG: DatasetConfig<GenreModel> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		name: { label: 'Name', type: 'string', flex: 10, editable: true },
	},
	file: 'genre.tsv',
} as const satisfies DatasetConfig<GenreModel>;

const PERSON_CONFIG: DatasetConfig<PersonModel> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		nconst: { label: 'NConst', type: 'string', flex: 1, editable: false },
		name: { label: 'Name', type: 'string', flex: 10, editable: true },
		birthYear: { label: 'Birth Year', type: 'number', flex: 1, editable: true },
		deathYear: { label: 'Death Year', type: 'number', flex: 1, editable: true },
	},
	file: 'person.tsv',
} as const satisfies DatasetConfig<PersonModel>;

const PROFESSION_CONFIG: DatasetConfig<ProfessionModel> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		name: { label: 'Name', type: 'string', flex: 1, editable: true },
	},
	file: 'profession.tsv',
} as const satisfies DatasetConfig<ProfessionModel>;

const TITLE_CONFIG: DatasetConfig<TitleModel> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		tconst: { label: 'TConst', type: 'string', flex: 2, editable: false },
		isAdult: { label: 'Is Adult?', type: 'boolean', flex: 2, editable: true },
		startYear: { label: 'Start Year', type: 'number', flex: 2, editable: true },
		endYear: { label: 'End Year', type: 'number', flex: 2, editable: true },
		runtimeMinutes: { label: 'Runtime Minutes', type: 'string', flex: 2, editable: true },
	},
	file: 'title.tsv',
} as const satisfies DatasetConfig<TitleModel>;

export const DATASET_CONFIGS: Record<DatasetKey, DatasetConfig<Dataset>> = {
	rawNameBasic: RAW_NAME_BASIC_CONFIG,
	rawTitleAka: RAW_TITLE_AKA_CONFIG,
	rawTitleBasic: RAW_TITLE_BASIC_CONFIG,
	rawTitleEpisode: RAW_TITLE_EPISODE_CONFIG,
	rawTitlePrincipal: RAW_TITLE_PRINCIPAL_CONFIG,
	rawTitleRating: RAW_TITLE_RATING_CONFIG,
	alias: ALIAS_CONFIG,
	character: CHARACTER_CONFIG,
	genre: GENRE_CONFIG,
	person: PERSON_CONFIG,
	profession: PROFESSION_CONFIG,
	title: TITLE_CONFIG,
} as const satisfies Record<DatasetKey, DatasetConfig<Dataset>>;

export function getDatasetConfigKeysArray(datasetKey: DatasetKey): string[] {
	return Object.keys(DATASET_CONFIGS[datasetKey].keys);
}

export function getDatasetConfigValuesArray(datasetKey: DatasetKey): KeyConfig[] {
	return Object.values(DATASET_CONFIGS[datasetKey].keys);
}

export function getDatasetConfigEntriesArray(datasetKey: DatasetKey): [string, KeyConfig][] {
	return Object.entries(DATASET_CONFIGS[datasetKey].keys);
}
