import type { DatasetDef, TypeFromSchema } from '../../dataset/entity/Datasets.ts';

export const RAW_NAME_BASIC_SCHEMA = {
	column: {
		id: { type: 'number', label: 'ID' },
		nconst: { type: 'string', label: 'NConst' },
		primaryName: { type: 'string', label: 'Primary Name' },
		birthYear: { type: 'string', label: 'Birth Year' },
		deathYear: { type: 'string', label: 'Death Year' },
		primaryProfession: { type: 'string', label: 'Primary Profession' },
		knownForTitles: { type: 'string', label: 'Known For Titles' },
	},
	file: 'name.basics.tsv',
} as const satisfies DatasetDef;

export type RawNameBasic = TypeFromSchema<typeof RAW_NAME_BASIC_SCHEMA>;
