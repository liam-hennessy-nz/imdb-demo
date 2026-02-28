import type { DatasetDef, TypeFromSchema } from '../../shared/entity/Datasets.ts';

export const RAW_TITLE_RATING_SCHEMA = {
	column: {
		tconst: { type: 'string', label: 'TConst' },
		averageRating: { type: 'string', label: 'Average Rating' },
		numVotes: { type: 'string', label: 'Number of Votes' },
	},
	file: 'title.ratings.tsv',
} as const satisfies DatasetDef;

export type RawTitleRating = TypeFromSchema<typeof RAW_TITLE_RATING_SCHEMA>;
