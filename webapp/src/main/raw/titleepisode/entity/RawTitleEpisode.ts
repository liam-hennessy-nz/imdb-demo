import type { DatasetConfig } from '../../../dataset/entity/Datasets.ts';

export interface RawTitleEpisode {
	id: number;
	tconst: string;
	parentTconst: string;
	seasonNumber: string;
	episodeNumber: string;
}

export const RAW_TITLE_EPISODE_CONFIG: DatasetConfig<RawTitleEpisode> = {
	keys: {
		id: { label: 'ID', type: 'number', flex: 1, editable: false },
		tconst: { label: 'TConst', type: 'string', flex: 1, editable: true },
		parentTconst: { label: 'Parent TConst', type: 'string', flex: 1, editable: true },
		seasonNumber: { label: 'Season Number', type: 'string', flex: 5, editable: true },
		episodeNumber: { label: 'Episode Number', type: 'string', flex: 5, editable: true },
	},
	file: 'title.episode.tsv',
} as const satisfies DatasetConfig<RawTitleEpisode>;
