import type { GridFilterItem, GridFilterModel, GridSortModel } from '@mui/x-data-grid';

export const WEBSOCKET = {
	CONNECT: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 5000,
		DO_RETRY_ON_FAIL: true,
	},
	VALIDATE: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		DO_RETRY_ON_FAIL: true,
		FILE_SNIPPET_SIZE_BYTES: 64 * 1024,
	},
	SEND: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		DO_RETRY_ON_FAIL: true,
	},
	CHUNK: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		DO_RETRY_ON_FAIL: true,
	},
} as const;

export const STORAGE = {
	KEYS: {
		IS_DARK_MODE_ENABLED: 'isDarkModeEnabled',
		DATASET_UPLOADS: 'datasetUploads',
	},
} as const;

export const PAGINATOR = {
	INIT: {
		PAGINATION: { page: 0, pageSize: 25 },
		SORT: [{ field: 'id', sort: 'asc' }] as GridSortModel,
		FILTER: { items: [] as GridFilterItem[] } as GridFilterModel,
	},
	PAGE_SIZE_OPTIONS: [5, 10, 15, 25, 50, 100],
} as const;
