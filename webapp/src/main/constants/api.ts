const host = import.meta.env.VITE_HOST as string;
const port = import.meta.env.VITE_PORT as string;
const apiPath = import.meta.env.VITE_API_PATH as string;
const webSocketSessionPath = import.meta.env.VITE_WEBSOCKET_SESSION_PATH as string;
const webSocketUploadPath = import.meta.env.VITE_WEBSOCKET_UPLOAD_PATH as string;

export const API_BASE_URL = `http://${host}:${port}/${apiPath}`;
export const WEBSOCKET_SESSION_URL = `ws://${host}:${port}/${webSocketSessionPath}`;
export const WEBSOCKET_UPLOAD_URL = `ws://${host}:${port}/${webSocketUploadPath}`;
