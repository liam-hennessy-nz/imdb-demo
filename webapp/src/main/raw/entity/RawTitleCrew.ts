import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawTitleCrew {
	id: number;
	tconst: string;
	directors: string;
	writers: string;
}

export const RAW_TITLE_CREW_CONFIG: DatasetConfig<RawTitleCrew> = {
	keys: {
		id: { label: 'ID', flex: 1 },
		tconst: { label: 'TConst', flex: 1 },
		directors: { label: 'Directors', flex: 1 },
		writers: { label: 'Writers', flex: 1 },
	},
	file: 'title.crew.tsv',
} as const satisfies DatasetConfig<RawTitleCrew>;
