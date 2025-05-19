export interface SessionSocketContextType {
	isConnected: boolean;
	send: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => Promise<void>;
}
