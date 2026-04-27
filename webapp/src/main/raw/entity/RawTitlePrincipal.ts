import type { DatasetDef, TypeFromSchema } from '../../dataset/entity/Datasets.ts';

export const RAW_TITLE_PRINCIPAL_SCHEMA = {
	column: {
		id: { type: 'number', label: 'ID' },
		tconst: { type: 'string', label: 'TConst' },
		ordering: { type: 'string', label: 'Ordering' },
		nconst: { type: 'string', label: 'NConst' },
		category: { type: 'string', label: 'Category' },
		job: { type: 'string', label: 'Job' },
		characters: { type: 'string', label: 'Characters' },
	},
	file: 'title.principals.tsv',
} as const satisfies DatasetDef;

export type RawTitlePrincipal = TypeFromSchema<typeof RAW_TITLE_PRINCIPAL_SCHEMA>;
