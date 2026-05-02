import type { DatasetConfig } from '../../dataset/entity/Datasets.ts';

export interface RawTitleEpisode {
	id: number;
	tconst: string;
	parentTconst: string;
	seasonNumber: string;
	episodeNumber: string;
}

export const RAW_TITLE_EPISODE_CONFIG: DatasetConfig<RawTitleEpisode> = {
	keys: {
		id: { label: 'ID', flex: 1 },
		tconst: { label: 'TConst', flex: 1 },
		parentTconst: { label: 'Parent TConst', flex: 1 },
		seasonNumber: { label: 'Season Number', flex: 1 },
		episodeNumber: { label: 'Episode Number', flex: 1 },
	},
	file: 'title.episode.tsv',
} as const satisfies DatasetConfig<RawTitleEpisode>;
