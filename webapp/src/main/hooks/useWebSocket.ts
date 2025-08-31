import { WEBSOCKET } from '../constants/constants.ts';
import { useEffect, useRef } from 'react';
import type { FileMetadata } from '../entities/metadata/FileMetadata.ts';
import { parseError, parseErrorMessage, sleep } from '../common/CommonFunctions.ts';
import type { ChunkMetadata } from '../entities/metadata/ChunkMetadata.ts';

export interface useWebSocketProps {
	url: string;
	connectMaxAttempts?: number;
	connectTimeoutMs?: number;
	doRetryOnConnectFail?: boolean;
	sendMaxAttempts?: number;
	sendTimeoutMs?: number;
	doRetryOnSendFail?: boolean;
	chunkMaxAttempts?: number;
	chunkTimeoutMs?: number;
	doRetryOnChunkFail?: boolean;
	chunkSize?: number;
	chunkMaxInFlight?: number;
	chunkAckInterval?: number;
	onProgress?: (progress: number) => void;
	onOpen?: (ws: WebSocket, ev: Event) => void;
	onMessage?: (ws: WebSocket, ev: MessageEvent) => void;
	onError?: (ws: WebSocket, ev: Event) => void;
	onClose?: (ws: WebSocket, ev: CloseEvent) => void;
}

export interface WebSocketState {
	ws: WebSocket | null;
	connect: () => Promise<void>;
	disconnect: () => void;
	send: (data: string | ArrayBufferLike) => Promise<void>;
	sendFile: (file: File) => Promise<void>;
}

export interface ChunkState {
	acked: boolean;
	timestamp: number;
}

/**
 * Hook that attempts to establish a WebSocket connection with the backend. It will hold the connection as a ref,
 * and has event listeners for onopen, onmessage, onerror and onclose.
 * @param props The properties for the WebSocket, url is required.
 * @return A resolved Promise containing the WebSocket ref and some controls if connection succeeds, else a rejected
 * Promise.
 */
function useWebSocket(props: useWebSocketProps): WebSocketState {
	const {
		url,
		connectMaxAttempts = WEBSOCKET.CONNECT.MAX_ATTEMPTS,
		connectTimeoutMs = WEBSOCKET.CONNECT.TIMEOUT_MS,
		doRetryOnConnectFail = true,
		sendMaxAttempts = WEBSOCKET.SEND.MAX_ATTEMPTS,
		sendTimeoutMs = WEBSOCKET.SEND.TIMEOUT_MS,
		doRetryOnSendFail = true,
		chunkMaxAttempts = WEBSOCKET.CHUNK.MAX_ATTEMPTS,
		chunkTimeoutMs = WEBSOCKET.CHUNK.TIMEOUT_MS,
		doRetryOnChunkFail = true,
		chunkSize = WEBSOCKET.CHUNK.SIZE,
		chunkMaxInFlight = WEBSOCKET.CHUNK.MAX_IN_FLIGHT,
		chunkAckInterval = WEBSOCKET.CHUNK.ACK_INTERVAL,
		onProgress,
		onOpen,
		onMessage,
		onError,
		onClose,
	} = props;

	const wsRef = useRef<WebSocket | null>(null);
	const isConnectedRef = useRef<boolean>(false);
	const totalChunksRef = useRef<number>(0);
	const chunkAcksRef = useRef<Record<number, ChunkState>>({});

	/**
	 * Function that sends a file via an established WebSocket to the backend. It breaks a provided file up into
	 * ArrayBuffer chunks of size {@link chunkSize}. Each chunk has a big-endian chunk index appended to it before being
	 * sent via {@link sendChunk} so that processed chunks are kept track of. Once all chunks are sent, an EOF
	 * message is sent which signals the backend to flush the data and close the connection.
	 * @param file The file to send through to backend.
	 */
	async function sendFile(file: File) {
		// Calculate total chunks needed for file
		const totalChunks = Math.ceil(file.size / chunkSize);
		totalChunksRef.current = totalChunks;

		// Create file metadata
		const metadata: FileMetadata = {
			type: 'HEAD',
			fileName: file.name,
			size: file.size,
			lastModified: file.lastModified,
			ackInterval: chunkAckInterval,
			totalChunks: totalChunks,
		};

		// Send metadata first to initialise stream with backend
		try {
			await send(JSON.stringify(metadata));
		} catch (ex) {
			throw parseError(ex);
		}

		// TODO: might be better to retrieve chunkSize from backend
		// Process files in chunks
		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
			if (wsRef.current?.readyState !== WebSocket.OPEN) {
				throw new Error('WebSocket connection was closed while streaming file');
			}
			console.debug(`Streaming chunk [${chunkIndex.toString()} / ${(totalChunks - 1).toString()}]...`);

			// Calculate start and end of this chunk
			const start = chunkIndex * chunkSize;
			const end = Math.min(start + chunkSize, file.size);

			// Get chunk data
			const chunk = await file.slice(start, end).arrayBuffer();

			// Header to hold the chunk index
			const header = new DataView(new ArrayBuffer(4));
			// Use big-endian here
			header.setUint32(0, chunkIndex);

			// Combined byte array that will hold the header in the first 4 bytes, followed by the chunk data
			const combined = new Uint8Array(4 + chunk.byteLength);
			combined.set(new Uint8Array(header.buffer), 0);
			combined.set(new Uint8Array(chunk), 4);

			// Send the chunk
			try {
				await sendChunk(combined.buffer, chunkIndex);
			} catch (ex) {
				throw parseError(ex);
			}
		}

		// Send EOF to finish stream with backend
		try {
			await send('EOF');
		} catch (ex) {
			throw parseError(ex);
		}

		// Check if all chunks were acknowledged
		const unackedCount = getUnackedChunkCount(chunkAcksRef.current);
		if (unackedCount > 0) {
			console.error(`Upload completed with ${unackedCount.toString()} chunks unacknowledged`);
		} else {
			console.debug(`Upload completed with all chunks acknowledged`);
		}
	}

	/**
	 * Function which sends an ArrayBuffer chunk via an established WebSocket to the backend. For added robustness, each
	 * chunk requires an ACK before the next one is sent. It sends the chunk via {@link send}, which causes this function
	 * to terminate if a rejected promise is returned. If no ACK is received after {@link chunkMaxAttempts} attempts, the
	 * function terminates. There is also a limit on in-flight chunks specified by {@link chunkMaxInFlight}. If the
	 * queue does not reduce after {@link chunkMaxAttempts} attempts, the function terminates.
	 * @param chunk The chunk to send through to backend.
	 * @param chunkIndex The index of the chunk relative to total chunks in a file.
	 */
	async function sendChunk(chunk: ArrayBufferLike, chunkIndex: number) {
		const chunkIndexStr = chunkIndex.toString();

		async function sendChunkWithAckAndRetry(maxAttempts: number) {
			const maxAttemptsStr = maxAttempts.toString();
			let isChunkSent = false;

			for (let attempt = 1; attempt <= chunkMaxAttempts; attempt++) {
				const attemptStr = attempt.toString();

				if (getUnackedChunkCount(chunkAcksRef.current) < chunkMaxInFlight) {
					try {
						if (!isChunkSent) {
							await send(chunk);
							isChunkSent = true;
						}
						chunkAcksRef.current[chunkIndex] = { acked: false, timestamp: Date.now() };
						if (chunkIndex % chunkAckInterval === 0 || chunkIndex === totalChunksRef.current - 1) {
							await new Promise<void>((resolve, reject) => {
								waitForChunkAck(resolve, reject);
							});
						}
						return;
					} catch (ex) {
						console.debug(
							`WebSocket [${url}] - Send failed (attempt ${attemptStr} / ${maxAttemptsStr}):`,
							`${parseErrorMessage(ex)}, retrying...`
						);
					}
				} else {
					const attemptStr = attempt.toString();
					console.debug(
						`WebSocket [${url}] - In-flight limit reached (attempt ${attemptStr} / ${maxAttemptsStr}), waiting...`
					);
					await sleep(chunkTimeoutMs);
				}
			}
			throw new Error(`In-flight limit exceeded (${maxAttemptsStr}), aborting...`);
		}

		function waitForChunkAck(resolve: () => void, reject: (reason: Error) => void) {
			let settled = false;

			const cleanup = () => {
				clearTimeout(timeout);
				clearInterval(checkAck);
			};

			const timeout = setTimeout(() => {
				if (!settled) {
					settled = true;
					cleanup();
					reject(new Error(`ACK wait exceeded for chunk [${chunkIndexStr}]`));
				}
			}, chunkTimeoutMs);

			const checkAck = setInterval(() => {
				if (settled) return;

				if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
					settled = true;
					cleanup();
					reject(new Error('WebSocket connection was closed while waiting for ACK'));
					return;
				}

				if (chunkAcksRef.current[chunkIndex].acked) {
					settled = true;
					cleanup();
					resolve();
				}
			}, 50);
		}

		try {
			await sendChunkWithAckAndRetry(doRetryOnChunkFail ? chunkMaxAttempts : 1);
		} catch (ex) {
			disconnect();
			throw parseError(ex);
		}
	}

	/**
	 * Function which establishes a new WebSocket connection to the backend before sending a string or chunk through it.
	 * If the data fails to send after {@link sendMaxAttempts} attempts, the function is terminated.
	 * @param data The string or ArrayBuffer chunk to send through to the backend.
	 */
	async function send(data: string | ArrayBufferLike): Promise<void> {
		async function sendWithRetry(maxAttempts: number) {
			const maxAttemptsStr = maxAttempts.toString();

			for (let attempt = 1; attempt <= maxAttempts; attempt++) {
				if (wsRef.current?.readyState !== WebSocket.OPEN) {
					throw new Error('Attempted to send data while WebSocket was not open');
				}

				try {
					wsRef.current.send(data);
					return;
				} catch (ex) {
					if (attempt < sendMaxAttempts) {
						const attemptStr = attempt.toString();
						console.debug(
							`WebSocket [${url}] - Send failed (attempt ${attemptStr} / ${maxAttemptsStr}):`,
							`${parseErrorMessage(ex)}, retrying...`
						);
						await sleep(sendTimeoutMs);
					}
				}
			}
			throw new Error(`Send attempt limit reached (${maxAttemptsStr}), aborting...`);
		}

		try {
			if (!isConnectedRef.current) {
				await connect();
			}
			await sendWithRetry(doRetryOnSendFail ? sendMaxAttempts : 1);
		} catch (e) {
			disconnect();
			throw parseError(e);
		}
	}

	/**
	 * Function that establishes a WebSocket connection with the backend. It also initialises listeners for onopen,
	 * onmessage, onerror and onclose.
	 *
	 * If {@link doRetryOnConnectFail} is set to false, the function will not attempt to
	 * establish a new connection if it fails to connect initially or is closed prematurely.
	 *
	 * Otherwise, use {@link connectMaxAttempts} and {@link connectTimeoutMs} to specify how many attempts should be made
	 * and how often to wait between attempts, if a reconnect is required.
	 */
	async function connect(): Promise<void> {
		// TODO: figure out why this needs to run twice after a transfer completes
		const timeoutMsStr = connectTimeoutMs.toString();

		async function connectWithRetry(maxAttempts: number) {
			const maxAttemptsStr = maxAttempts.toString();

			for (let attempt = 1; attempt <= maxAttempts; attempt++) {
				try {
					await new Promise<void>((resolve, reject) => {
						connectWithTimeout(resolve, reject);
					});
					return;
				} catch (ex) {
					if (attempt < connectMaxAttempts) {
						const attemptStr = attempt.toString();
						console.debug(
							`WebSocket [${url}] - Connect failed (attempt ${attemptStr} / ${maxAttemptsStr}):`,
							`${parseErrorMessage(ex)}, retrying...`
						);
						await sleep(connectTimeoutMs);
					}
				}
			}
			throw new Error(`Connect attempt limit reached (${maxAttemptsStr}), aborting...`);
		}

		function connectWithTimeout(resolve: () => void, reject: (reason: Error) => void) {
			if (wsRef.current) {
				console.debug(`WebSocket [${url}] - Connection already exists, disconnecting...`);
				disconnect();
			}
			const ws = new WebSocket(url);
			wsRef.current = ws;

			const timeout = setTimeout(() => {
				disconnect();
				reject(new Error(`WebSocket connection timed out after ${timeoutMsStr}ms`));
			}, connectTimeoutMs);

			ws.onopen = (ev: Event) => {
				handleOpen(ws, ev, timeout, resolve);
			};
			ws.onmessage = (ev: MessageEvent<string>) => {
				handleMessage(ws, ev);
			};
			ws.onerror = (ev: Event) => {
				handleError(ws, ev, timeout, reject);
			};
			ws.onclose = async (ev: CloseEvent) => {
				await handleClose(ws, ev);
			};
		}

		function handleOpen(ws: WebSocket, ev: Event, timeout: NodeJS.Timeout, resolve: () => void) {
			clearTimeout(timeout);
			isConnectedRef.current = true;
			resolve();
			console.debug(`WebSocket [${url}] - Connection established.`);
			onOpen?.(ws, ev);
		}

		function handleMessage(ws: WebSocket, ev: MessageEvent<string>) {
			const { chunkIndex, type } = parseChunkMetadata(ev.data);
			console.debug(`WebSocket [${url}] - Message received:`, ev.data);

			if (type === 'ACK') {
				for (let i = chunkIndex; i > chunkIndex - chunkAckInterval; i--) {
					chunkAcksRef.current[i] = { acked: true, timestamp: Date.now() };
				}
				// Return percentage completed
				onProgress?.((chunkIndex / totalChunksRef.current) * 100);
			}
			onMessage?.(ws, ev);
		}

		function handleError(ws: WebSocket, ev: Event, timeout: NodeJS.Timeout, reject: (reason: Error) => void) {
			clearTimeout(timeout);
			reject(new Error('WebSocket connection failed'));
			onError?.(ws, ev);
		}

		async function handleClose(ws: WebSocket, ev: CloseEvent) {
			wsRef.current = null;
			if (doRetryOnConnectFail && !ev.wasClean && isConnectedRef.current) {
				try {
					await connectWithRetry(connectMaxAttempts);
				} catch (ex) {
					console.error(`WebSocket [${url}] - Reconnect failed: ${parseErrorMessage(ex)}`);
					onClose?.(ws, ev);
				}
			} else {
				console.debug(`WebSocket [${url}] - Connection terminated.`);
				onClose?.(ws, ev);
			}
		}

		try {
			await connectWithRetry(doRetryOnConnectFail ? connectMaxAttempts : 1);
		} catch (ex) {
			throw parseError(ex);
		}
	}

	/**
	 * Function which closes the existing WebSocket connection and clears all refs.
	 */
	function disconnect() {
		isConnectedRef.current = false;
		chunkAcksRef.current = {};
		wsRef.current?.close();
		wsRef.current = null;
	}

	/**
	 * Helper function which counts the number of unacked chunks within a ChunkState Record.
	 * @param chunks A record containing {@link ChunkState} mapped to a chunk index.
	 */
	function getUnackedChunkCount(chunks: Record<number, ChunkState>) {
		return Object.values(chunks).filter((chunk) => !chunk.acked).length;
	}

	/**
	 * Helper function which parses ChunkMetadata from JSON-string to an object.
	 * @param message A string containing {@link ChunkMetadata} in JSON format.
	 */
	function parseChunkMetadata(message: string) {
		let data: unknown;

		// Attempt to parse string
		try {
			data = JSON.parse(message);
		} catch (e) {
			throw new Error(`Invalid message: ${parseErrorMessage(e)}`);
		}

		// Validate parsed object has correct ChunkMetadata properties
		if (
			typeof data !== 'object' ||
			data === null ||
			!('chunkIndex' in data) ||
			!('type' in data) ||
			typeof data.type !== 'string' ||
			typeof data.chunkIndex !== 'number'
		) {
			throw new Error(`Invalid message: ${message}`);
		}

		return data as ChunkMetadata;
	}

	useEffect(() => {
		return () => {
			// Ensure WebSocket is closed and cleaned up on component unmount
			disconnect();
		};
	}, []);

	return {
		ws: wsRef.current,
		connect,
		disconnect,
		send,
		sendFile,
	};
}

export default useWebSocket;
