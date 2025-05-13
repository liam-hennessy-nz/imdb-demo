import { useEffect, useRef, useState } from 'react';

interface useWebSocketProps {
	isConnected: boolean;
	connect: () => Promise<void>;
	disconnect: () => void;
	send: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
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

	const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			socketRef.current.send(data);
			console.debug(`WebSocket [${url}] sent data`);
		} else {
			console.debug(`WebSocket [${url}] not open, failed to send data`);
		}
	};

	const streamFileInChunks = async (file: File) => {
		const reader = file.stream().getReader();

		const { done, value } = await reader.read();
		if (!done && socketRef.current) {
			socketRef.current.send(value);
		}
	};

	useEffect(() => {
		return () => {
			if (isConnected) {
				disconnect();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		isConnected,
		connect,
		disconnect,
		send,
		streamFileInChunks,
	};
}

export default useWebSocket;
