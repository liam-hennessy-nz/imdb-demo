const host = import.meta.env.VITE_HOST as string;
const port = import.meta.env.VITE_PORT as string;
const apiPath = import.meta.env.VITE_API_PATH as string;
const webSocketSessionPath = import.meta.env.VITE_WEBSOCKET_SESSION_PATH as string;
const webSocketUploadPath = import.meta.env.VITE_WEBSOCKET_UPLOAD_PATH as string;

export const API = {
	BASE_URL: `http://${host}:${port}/${apiPath}`,
	WEBSOCKET_SESSION_URL: `ws://${host}:${port}/${webSocketSessionPath}`,
	WEBSOCKET_UPLOAD_URL: `ws://${host}:${port}/${webSocketUploadPath}`,
};
