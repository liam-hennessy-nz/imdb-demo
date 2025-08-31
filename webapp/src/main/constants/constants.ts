function getChunkSizeFromEnv() {
	const chunkSize = import.meta.env.VITE_WS_CHUNK_SIZE as unknown as string;
	const chunkSizeInt = parseInt(chunkSize, 10);
	if (isNaN(chunkSizeInt) || !isFinite(chunkSizeInt) || chunkSizeInt <= 0) {
		throw new Error(`Invalid chunk_size specified in .env: ${chunkSize}`);
	}
	return chunkSizeInt;
}

export const WEBSOCKET = {
	CONNECT: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 5000,
	},
	SEND: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 500,
	},
	CHUNK: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		SIZE: getChunkSizeFromEnv(),
		MAX_IN_FLIGHT: 300, // Maximum allowed unACKed chunks
		ACK_INTERVAL: 50, // Only check for an ACK every x chunks
	},
};

export const STORAGE = {
	IS_SIDEBAR_VISIBLE: 'isSidebarVisible',
	WEBSOCKET_STREAM_UUID: 'websocketStreamUuid',
};

export const DATE_FORMAT = {
	LOG: 'YYYY-MM-DD HH:mm:ss.SSS',
};
