import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawTitlePrincipal {
	id: number;
	tconst: string;
	ordering: string;
	nconst: string;
	category: string;
	job: string;
	characters: string;
}

export const RAW_TITLE_PRINCIPAL_CONFIG: DatasetConfig<RawTitlePrincipal> = {
	keys: {
		id: { label: 'ID', flex: 1 },
		tconst: { label: 'TConst', flex: 1 },
		ordering: { label: 'Ordering', flex: 1 },
		nconst: { label: 'NConst', flex: 1 },
		category: { label: 'Category', flex: 1 },
		job: { label: 'Job', flex: 1 },
		characters: { label: 'Characters', flex: 1 },
	},
	file: 'title.principals.tsv',
} as const satisfies DatasetConfig<RawTitlePrincipal>;
