import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

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
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: true },
		ordering: { label: 'Ordering', type: 'string', flex: 1, editable: true },
		nconst: { label: 'NConst', type: 'string', flex: 1, editable: true },
		category: { label: 'Category', type: 'string', flex: 3, editable: true },
		job: { label: 'Job', type: 'string', flex: 3, editable: true },
		characters: { label: 'Characters', type: 'string', flex: 3, editable: true },
	},
	file: 'title.principals.tsv',
} as const satisfies DatasetConfig<RawTitlePrincipal>;
