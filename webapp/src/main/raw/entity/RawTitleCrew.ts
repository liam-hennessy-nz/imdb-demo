import type { DatasetDef, TypeFromSchema } from '../../shared/entity/Datasets.ts';

export const RAW_TITLE_CREW_SCHEMA = {
	column: {
		tconst: { type: 'string', label: 'TConst' },
		directors: { type: 'string', label: 'Directors' },
		writers: { type: 'string', label: 'Writers' },
	},
	file: 'title.crew.tsv',
} as const satisfies DatasetDef;

export type RawTitleCrew = TypeFromSchema<typeof RAW_TITLE_CREW_SCHEMA>;
