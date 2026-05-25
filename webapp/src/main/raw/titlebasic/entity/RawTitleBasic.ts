import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

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
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
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
