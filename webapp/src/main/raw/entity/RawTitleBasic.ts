import type { DatasetDef, TypeFromSchema } from '../../shared/entity/Datasets.ts';

export const RAW_TITLE_BASIC_SCHEMA = {
	column: {
		tconst: { type: 'string', label: 'TConst' },
		titleType: { type: 'string', label: 'Title Type' },
		primaryTitle: { type: 'string', label: 'Primary Title' },
		originalTitle: { type: 'string', label: 'Original Title' },
		isAdult: { type: 'string', label: 'Adult?' },
		startYear: { type: 'string', label: 'Start Year' },
		endYear: { type: 'string', label: 'End Year' },
		runtimeMinutes: { type: 'string', label: 'Runtime (mins)' },
		genres: { type: 'string', label: 'Genre' },
	},
	file: 'title.basics.tsv',
} as const satisfies DatasetDef;

export type RawTitleBasic = TypeFromSchema<typeof RAW_TITLE_BASIC_SCHEMA>;
