export const WEBSOCKET = {
	CONNECT: {
		RETRY_LIMIT: 3,
		RETRY_TIMEOUT_MS: 500,
	},
	SEND: {
		RETRY_LIMIT: 3,
		RETRY_TIMEOUT_MS: 500,
	},
	CHUNK: {
		RETRY_LIMIT: 3,
		RETRY_TIMEOUT_MS: 500,
		SIZE: 1024 * 1024,
		IN_FLIGHT_LIMIT: 5,
	},
};

export const STORAGE = {
	IS_SIDEBAR_VISIBLE: 'isSidebarVisible',
	WEBSOCKET_STREAM_UUID: 'websocketStreamUuid',
};

export const DATE_FORMAT = {
	LOG: 'YYYY-MM-DD HH:mm:ss.SSS',
};
