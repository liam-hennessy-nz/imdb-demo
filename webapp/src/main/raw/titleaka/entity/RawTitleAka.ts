import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

export interface RawTitleAka {
	id: number;
	tconst: string;
	ordering: string;
	title: string;
	region: string;
	language: string;
	types: string;
	attributes: string;
	isOriginalTitle: string;
}

export const RAW_TITLE_AKA_CONFIG: DatasetConfig<RawTitleAka> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
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
