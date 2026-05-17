import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

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
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		nconst: { label: 'NConst', type: 'string', flex: 2, editable: false },
		primaryName: { label: 'Primary Name', type: 'string', flex: 3, editable: true },
		birthYear: { label: 'Birth Year', type: 'string', flex: 2, editable: true },
		deathYear: { label: 'Death Year', type: 'string', flex: 2, editable: true },
		primaryProfession: { label: 'Primary Profession', type: 'longText', flex: 4, editable: true },
		knownForTitles: { label: 'Known For Titles', type: 'longText', flex: 4, editable: true },
	},
	file: 'name.basics.tsv',
} as const satisfies DatasetConfig<RawNameBasic>;
