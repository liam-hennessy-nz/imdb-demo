import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawNameBasic {
	id: number;
	nconst: string;
	primaryName: string;
	birthYear: string;
	deathYear: string;
	primaryProfession: string;
	knownForTitles: string;
}

export const RAW_NAME_BASIC_CONFIG: DatasetConfig<RawNameBasic> = {
	keys: {
		id: { label: 'ID', flex: 1 },
		nconst: { label: 'NConst', flex: 2 },
		primaryName: { label: 'Primary Name', flex: 3 },
		birthYear: { label: 'Birth Year', flex: 2 },
		deathYear: { label: 'Death Year', flex: 2 },
		primaryProfession: { label: 'Primary Profession', flex: 4 },
		knownForTitles: { label: 'Known For Titles', flex: 4 },
	},
	file: 'name.basics.tsv',
} as const satisfies DatasetConfig<RawNameBasic>;
