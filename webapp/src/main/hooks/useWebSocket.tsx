import { useEffect, useRef, useState } from 'react';
import { CHUNK_SIZE } from '../constants/constants.tsx';
import { parseErrorMessage } from '../common/CommonFunctions.ts';
import type { FileMetadata } from '../entities/FileMetadata.ts';

interface useWebSocketProps {
	isConnected: boolean;
	connect: () => Promise<void>;
	disconnect: () => void;
	send: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => Promise<void>;
	streamFileInChunks: (file: File) => Promise<void>;
}

function useWebSocket(url: string): useWebSocketProps {
	const socketRef = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	const connect = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			socketRef.current = new WebSocket(url);

			socketRef.current.binaryType = 'arraybuffer';

			socketRef.current.onopen = () => {
				setIsConnected(true);
				console.debug(`WebSocket [${url}] opened`);
				resolve();
			};
			socketRef.current.onerror = () => {
				setIsConnected(false);
				console.debug(`WebSocket [${url}] errored`);
				reject(new Error('WebSocket failed to connect'));
			};
			socketRef.current.onclose = () => {
				setIsConnected(false);
				console.debug(`WebSocket [${url}] closed`);
			};
		});
	};

	const disconnect = () => {
		if (socketRef.current) {
			socketRef.current.close(1000, 'Client disconnected');
			socketRef.current = null;
			setIsConnected(false);
		}
	};

	const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
				socketRef.current.send(data);
				console.debug(`WebSocket [${url}] sent data`);
				resolve();
			} else {
				console.debug(`WebSocket [${url}] not open, failed to send data`);
				reject(new Error('WebSocket not open, failed to send data'));
			}
		});
	};

	const streamFileInChunks = async (file: File): Promise<void> => {
		let offset = 0;

		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			const metadata: FileMetadata = {
				type: 'header',
				fileName: file.name,
				size: file.size,
				lastModified: file.lastModified,
			};

			try {
				await send(JSON.stringify(metadata));
			} catch (e) {
				throw new Error(parseErrorMessage(e));
			}
		}

		const readChunk = (): Promise<void> => {
			return new Promise((resolve, reject) => {
				const chunk = file.slice(offset, offset + CHUNK_SIZE);
				const reader = new FileReader();

				reader.onload = async () => {
					if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

					if (reader.result) {
						try {
							await send(reader.result);
						} catch (e) {
							reject(new Error(parseErrorMessage(e)));
						}

						offset += CHUNK_SIZE;

						if (offset < file.size) {
							try {
								await readChunk();
								resolve();
							} catch (e) {
								reject(new Error(parseErrorMessage(e)));
							}
						} else {
							try {
								await send(new TextEncoder().encode('EOF'));
							} catch (e) {
								reject(new Error(parseErrorMessage(e)));
								return;
							}
							disconnect();
							resolve();
						}
					}
				};

				reader.onerror = () => {
					reject(new Error('File reading failed'));
				};

				reader.readAsArrayBuffer(chunk);
			});
		};

		await readChunk();
	};

	useEffect(() => {
		return () => {
			if (isConnected) {
				disconnect();
			}
		};
	}, [isConnected]);

	return {
		isConnected,
		connect,
		disconnect,
		send,
		streamFileInChunks,
	};
}

export default useWebSocket;
