import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawTitleBasic {
	id: number;
	tconst: string;
	titleType: string;
	primaryTitle: string;
	originalTitle: string;
	isAdult: string;
	startYear: string;
	endYear: string;
	runtimeMinutes: string;
	genres: string;
}

export const RAW_TITLE_BASIC_CONFIG: DatasetConfig<RawTitleBasic> = {
	keys: {
		id: { label: 'ID', flex: 1 },
		tconst: { label: 'TConst', flex: 1 },
		titleType: { label: 'Title Type', flex: 1 },
		primaryTitle: { label: 'Primary Title', flex: 1 },
		originalTitle: { label: 'Original Title', flex: 1 },
		isAdult: { label: 'Adult?', flex: 1 },
		startYear: { label: 'Start Year', flex: 1 },
		endYear: { label: 'End Year', flex: 1 },
		runtimeMinutes: { label: 'Runtime (mins)', flex: 1 },
		genres: { label: 'Genre', flex: 1 },
	},
	file: 'title.basics.tsv',
} as const satisfies DatasetConfig<RawTitleBasic>;
