import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawTitleAka {
	id: number;
	titleId: string;
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
		id: { label: 'ID', flex: 1 },
		titleId: { label: 'Title ID', flex: 1 },
		ordering: { label: 'Ordering', flex: 1 },
		title: { label: 'Title', flex: 1 },
		region: { label: 'Region', flex: 1 },
		language: { label: 'Language', flex: 1 },
		types: { label: 'Types', flex: 1 },
		attributes: { label: 'Attributes', flex: 1 },
		isOriginalTitle: { label: 'Original Title?', flex: 1 },
	},
	file: 'title.akas.tsv',
} as const satisfies DatasetConfig<RawTitleAka>;
