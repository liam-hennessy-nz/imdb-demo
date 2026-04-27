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
		IS_SIDEBAR_VISIBLE: 'isSidebarVisible',
		IS_UPLOADS_VISIBLE: 'isUploadsVisible',
		DATASET_UPLOADS: 'datasetUploads',
	},
} as const;

export const PAGINATOR = {
	DEFAULT_SIZE: 25,
} as const;
