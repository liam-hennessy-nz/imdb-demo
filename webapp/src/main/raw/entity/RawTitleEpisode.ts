import type { DatasetDef, TypeFromSchema } from '../../dataset/entity/Datasets.ts';

export const RAW_TITLE_EPISODE_SCHEMA = {
	column: {
		id: { type: 'number', label: 'ID' },
		tconst: { type: 'string', label: 'TConst' },
		parentTconst: { type: 'string', label: 'Parent TConst' },
		seasonNumber: { type: 'string', label: 'Season Number' },
		episodeNumber: { type: 'string', label: 'Episode Number' },
	},
	file: 'title.episode.tsv',
} as const satisfies DatasetDef;

export type RawTitleEpisode = TypeFromSchema<typeof RAW_TITLE_EPISODE_SCHEMA>;
