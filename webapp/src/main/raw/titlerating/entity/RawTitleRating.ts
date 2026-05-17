import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

export interface RawTitleRating {
	id: number;
	tconst: string;
	averageRating: string;
	numVotes: string;
}

export const RAW_TITLE_RATING_CONFIG: DatasetConfig<RawTitleRating> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: true },
		averageRating: { label: 'Average Rating', type: 'string', flex: 5, editable: true },
		numVotes: { label: 'Number of Votes', type: 'string', flex: 5, editable: true },
	},
	file: 'title.ratings.tsv',
} as const satisfies DatasetConfig<RawTitleRating>;
