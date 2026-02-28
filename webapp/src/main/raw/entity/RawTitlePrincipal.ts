import type { DatasetDef, TypeFromSchema } from '../../shared/entity/Datasets.ts';

export const RAW_TITLE_PRINCIPAL_SCHEMA = {
	column: {
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
