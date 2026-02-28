const apiHost = import.meta.env.VITE_API_HOST as string;
const apiPort = parseInt(import.meta.env.VITE_API_PORT as string, 10).toString();
const useTls = import.meta.env.VITE_USE_TLS === 'true';

const protocol = useTls ? 'https' : 'http';
const wsProtocol = useTls ? 'wss' : 'ws';

export const API = {
	BASE_URL: `${protocol}://${apiHost}:${apiPort}/api`,
	WEBSOCKET_SESSION_URL: `${wsProtocol}://${apiHost}:${apiPort}/ws/session`,
	WEBSOCKET_UPLOAD_URL: `${wsProtocol}://${apiHost}:${apiPort}/ws/upload`,
};
