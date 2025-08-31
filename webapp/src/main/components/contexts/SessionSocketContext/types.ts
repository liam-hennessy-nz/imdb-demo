import type { WebSocketState } from '../../../hooks/useWebSocket.ts';

export interface SessionSocketContextType {
	ws: WebSocketState;
	setIsUploadProgressVisible: (visible: boolean) => void;
	setUploadProgress: (progress: number) => void;
}
