import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawTitleRating {
	id: number;
	tconst: string;
	averageRating: string;
	numVotes: string;
}

export const RAW_TITLE_RATING_CONFIG: DatasetConfig<RawTitleRating> = {
	keys: {
		id: { label: 'ID', flex: 1 },
		tconst: { label: 'TConst', flex: 1 },
		averageRating: { label: 'Average Rating', flex: 1 },
		numVotes: { label: 'Number of Votes', flex: 1 },
	},
	file: 'title.ratings.tsv',
} as const satisfies DatasetConfig<RawTitleRating>;
