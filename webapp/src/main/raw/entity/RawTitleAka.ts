import type { DatasetDef, TypeFromSchema } from '../../shared/entity/Datasets.ts';

export const RAW_TITLE_AKA_SCHEMA = {
	column: {
		titleId: { type: 'string', label: 'Title ID' },
		ordering: { type: 'string', label: 'Ordering' },
		title: { type: 'string', label: 'Title' },
		region: { type: 'string', label: 'Region' },
		language: { type: 'string', label: 'Language' },
		types: { type: 'string', label: 'Types' },
		attributes: { type: 'string', label: 'Attributes' },
		isOriginalTitle: { type: 'string', label: 'Original Title?' },
	},
	file: 'title.akas.tsv',
} as const satisfies DatasetDef;

export type RawTitleAka = TypeFromSchema<typeof RAW_TITLE_AKA_SCHEMA>;
