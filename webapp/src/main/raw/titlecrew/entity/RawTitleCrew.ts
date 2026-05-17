import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

export interface RawTitleCrew {
	id: number;
	tconst: string;
	directors: string;
	writers: string;
}

export const RAW_TITLE_CREW_CONFIG: DatasetConfig<RawTitleCrew> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: true },
		directors: { label: 'Directors', type: 'string', flex: 5, editable: true },
		writers: { label: 'Writers', type: 'string', flex: 5, editable: true },
	},
	file: 'title.crew.tsv',
} as const satisfies DatasetConfig<RawTitleCrew>;
