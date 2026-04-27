const apiHost = import.meta.env.VITE_API_HOST as string;
const apiPort = parseInt(import.meta.env.VITE_API_PORT as string, 10).toString();
const useTls = import.meta.env.VITE_USE_TLS === 'true';
const apiScheme = useTls ? 'https' : 'http';
const wsScheme = useTls ? 'wss' : 'ws';

export const ENDPOINT = {
	API: new URL(`${apiScheme}://${apiHost}:${apiPort}/api`),
	WEBSOCKET: new URL(`${wsScheme}://${apiHost}:${apiPort}/ws`),
} as const;
