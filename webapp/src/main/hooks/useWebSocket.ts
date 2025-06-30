import { DATE_FORMAT, WEBSOCKET } from '../constants/constants.ts';
import { useEffect, useRef, useState } from 'react';
import type { PromiseHandlers } from '../common/CommonTypes.ts';
import dayjs from 'dayjs';
import type { FileMetadata } from '../entities/metadata/FileMetadata.ts';
import { parseErrorMessage, sleep } from '../common/CommonFunctions.ts';
import type { ChunkMetadata } from '../entities/metadata/ChunkMetadata.ts';

export interface useWebSocketProps {
	url: string;
	connectRetryLimit?: number;
	connectRetryTimeoutMs?: number;
	connectRetryOnClose?: boolean;
	sendRetryLimit?: number;
	sendRetryTimeoutMs?: number;
	chunkRetryLimit?: number;
	chunkTimeoutMs?: number;
	chunkSize?: number;
	chunkInFlightLimit?: number;
	onOpen?: (ws: WebSocket, ev: Event) => void;
	onMessage?: (ws: WebSocket, ev: MessageEvent) => void;
	onError?: (ws: WebSocket, ev: Event) => void;
	onClose?: (ws: WebSocket, ev: CloseEvent) => void;
}

export interface WebSocketState {
	ws: WebSocket | null;
	isConnected: boolean;
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
		connectRetryLimit = WEBSOCKET.CONNECT.RETRY_LIMIT,
		connectRetryTimeoutMs = WEBSOCKET.CONNECT.RETRY_TIMEOUT_MS,
		connectRetryOnClose = true,
		sendRetryLimit = WEBSOCKET.SEND.RETRY_LIMIT,
		sendRetryTimeoutMs = WEBSOCKET.SEND.RETRY_TIMEOUT_MS,
		chunkRetryLimit = WEBSOCKET.CHUNK.RETRY_LIMIT,
		chunkTimeoutMs = WEBSOCKET.CHUNK.RETRY_TIMEOUT_MS,
		chunkSize = WEBSOCKET.CHUNK.SIZE,
		chunkInFlightLimit = WEBSOCKET.CHUNK.IN_FLIGHT_LIMIT,
		onOpen,
		onMessage,
		onError,
		onClose,
	} = props;

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const wsRef = useRef<WebSocket | null>(null);
	const manuallyClosedRef = useRef<boolean>(false);
	const connectPromiseRef = useRef<PromiseHandlers | null>(null);
	const connectRetryCountRef = useRef<number>(0);
	const chunkAcksRef = useRef<Record<number, ChunkState>>({});

	/**
	 * Helper function that generates a console log prefix containing the current time and WebSocket URL.
	 */
	function generateLogPrefix() {
		return `[${dayjs().format(DATE_FORMAT.LOG)}] WebSocket [${url}]`;
	}

	/**
	 * Function that calls {@link attemptConnect} and returns a resolved promise if the WebSocket connection to backend is
	 * successful, else a rejected promise is returned instead.
	 */
	function connect(): Promise<void> {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			connectRetryCountRef.current = 0;
			manuallyClosedRef.current = false;
			connectPromiseRef.current ??= { resolve, reject };
			attemptConnect();
		});
	}

	/**
	 * Function that establishes a WebSocket connection with the backend. It also initialises listeners for onopen,
	 * onmessage, onerror and onclose.
	 */
	function attemptConnect() {
		const ws = new WebSocket(url);
		wsRef.current = ws;

		ws.onopen = handleOpen;
		ws.onmessage = handleMessage;
		ws.onerror = handleError;
		ws.onclose = handleClose;
	}

	/**
	 * Function that sends a file via an established WebSocket to the backend. It breaks a provided file up into
	 * ArrayBuffer chunks of size {@link chunkSize}. Each chunk has a big-endian chunk index appended to it before being
	 * sent via {@link sendChunkWithAck} so that processed chunks are kept track of. Once all chunks are sent, an EOF
	 * message is sent which signals the backend to flush the data and close the connection.
	 * @param file The file to send through to backend.
	 */
	async function sendFile(file: File) {
		// Create file metadata
		const metadata: FileMetadata = {
			type: 'HEAD',
			fileName: file.name,
			size: file.size,
			lastModified: file.lastModified,
		};

		// Send metadata first to initialise stream with backend
		await send(JSON.stringify(metadata));

		// Calculate total chunks needed for file
		const totalChunks = Math.ceil(file.size / chunkSize);

		// Process files in chunks
		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
			console.debug(
				`${generateLogPrefix()} - Streaming chunk [${chunkIndex.toString()} / ${totalChunks.toString()}]...`
			);

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
			await sendChunkWithAck(combined.buffer, chunkIndex);
		}

		// Send EOF to finish stream with backend
		await send('EOF');

		// Check if all chunks were acknowledged
		const unackedCount = getUnackedChunkCount(chunkAcksRef.current);
		if (unackedCount > 0) {
			console.error(`${generateLogPrefix()} - Upload completed with ${unackedCount.toString()} chunks unacknowledged`);
		} else {
			console.debug(`${generateLogPrefix()} - Upload completed with all chunks acknowledged`);
		}
	}

	/**
	 * Function which sends an ArrayBuffer chunk via an established WebSocket to the backend. For added robustness, each
	 * chunk requires an ACK before the next one is sent. It sends the chunk via {@link send}, which causes this function
	 * to terminate if a rejected promise is returned. If no ACK is received after {@link chunkRetryLimit} attempts, the
	 * function is terminated. There is also a limit on in-flight chunks specified by {@link chunkInFlightLimit}. If the
	 * queue does not reduce after {@link chunkRetryLimit} attempts, the function is terminated.
	 * @param chunk The chunk to send through to backend.
	 * @param chunkIndex The index of the chunk relative to total chunks in a file.
	 */
	async function sendChunkWithAck(chunk: ArrayBufferLike, chunkIndex: number) {
		const retryLimitStr = (chunkRetryLimit + 1).toString();
		const chunkIndexStr = chunkIndex.toString();

		// While there are more unacked chunks than the in-flight limit...
		let inFlightRetryCount = 0;
		while (getUnackedChunkCount(chunkAcksRef.current) >= chunkInFlightLimit) {
			const retryCountStr = (inFlightRetryCount + 1).toString();

			// If retry limit is exceeded, throw error
			if (inFlightRetryCount > chunkRetryLimit) {
				throw new Error(
					`${generateLogPrefix()} - In-flight limit (${retryLimitStr}) exceeded for chunk [${chunkIndexStr}], aborting...`
				);
			}
			// Else, wait some time before trying again
			console.debug(
				`${generateLogPrefix()} - In-flight limit reached for chunk [${chunkIndexStr}] (attempt ${retryCountStr} / ${retryLimitStr}), waiting...`
			);
			await sleep(chunkTimeoutMs);
			inFlightRetryCount++;
		}

		// Initialise chunk record as unACKed
		chunkAcksRef.current[chunkIndex] = { acked: false, timestamp: Date.now() };

		// Attempt to send chunk
		try {
			await send(chunk);
		} catch (e) {
			throw new Error(`${generateLogPrefix()} - Failed to send chunk: ${parseErrorMessage(e)}`);
		}
		// Timeout before checking for ACK
		await sleep(chunkTimeoutMs);

		// While no ACK has been received from backend...
		let ackRetryCount = 0;
		while (!chunkAcksRef.current[chunkIndex].acked) {
			const retryCountStr = (ackRetryCount + 1).toString();

			// If retry limit is reached, throw error
			if (ackRetryCount > chunkRetryLimit) {
				throw new Error(
					`${generateLogPrefix()} - ACK await limit (${retryLimitStr}) exceeded for chunk [${chunkIndexStr}], aborting...`
				);
			}
			// Else, wait some time before trying again
			console.debug(
				`${generateLogPrefix()} - No ACK for chunk [${chunkIndexStr}] (attempt ${retryCountStr} / ${retryLimitStr}), waiting...`
			);
			await sleep(chunkTimeoutMs);
			ackRetryCount++;
		}
	}

	/**
	 * Function which establishes a new WebSocket connection to the backend before sending a string or chunk through it.
	 * A resolved promise is returned if this succeeds, else a rejected promise if it fails.
	 * @param data The string or ArrayBuffer chunk to send through to the backend.
	 */
	async function send(data: string | ArrayBufferLike): Promise<void> {
		// Attempt to connect
		try {
			await connect();
		} catch (e) {
			return Promise.reject(new Error(parseErrorMessage(e)));
		}
		// Attempt to send
		return attemptSend(data);
	}

	/**
	 * Function which sends a string or ArrayBuffer chunk via an established WebSocket to the backend. If the data fails
	 * to send after {@link sendRetryLimit} attempts, the function is terminated.
	 * @param data
	 */
	async function attemptSend(data: string | ArrayBufferLike): Promise<void> {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			throw new Error('Attempted to send data while WebSocket was not open');
		}

		const retryLimitStr = (sendRetryLimit + 1).toString();

		// While retry limit has not been reached...
		let sendRetryCount = 0;
		while (sendRetryCount <= sendRetryLimit) {
			const retryCountStr = (sendRetryCount + 1).toString();

			// Attempt to send data
			try {
				wsRef.current.send(data);
				return;
			} catch (e) {
				console.debug(
					`${generateLogPrefix()} - Send failed (attempt ${retryCountStr} / ${retryLimitStr}): ${parseErrorMessage(e)}, retrying...`
				);
			}

			// If retry limit is reached, throw error
			sendRetryCount++;
			if (sendRetryCount > sendRetryLimit) {
				const msg = `${generateLogPrefix()} - Send retry limit reached (${retryLimitStr}), aborting...`;
				throw new Error(msg);
			}
			// Else, wait some time before trying again
			await sleep(sendRetryTimeoutMs);
		}
	}

	/**
	 * Function which closes the existing WebSocket connection and clears all refs.
	 */
	function disconnect() {
		manuallyClosedRef.current = true;
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
			// Ensure WebSocket is closed and cleaned up on component unmount.
			disconnect();
		};
	}, []);

	/**
	 * Handler function that handles what should happen when a WebSocket connection is established. It resolves the
	 * connectPromiseRef which allows {@link connect} to resolve. If {@link onOpen} is provided, it is called with the
	 * same properties this function was called with.
	 * @param ev The event which triggered this function.
	 */
	function handleOpen(this: WebSocket, ev: Event) {
		onOpen?.(this, ev);

		connectRetryCountRef.current = 0;
		setIsConnected(true);
		connectPromiseRef.current?.resolve();
		connectPromiseRef.current = null;
	}

	/**
	 * Handler function that handles what should happen when a WebSocket receives a message from the backend. The message
	 * must be a {@link ChunkMetadata} object in JSON-string form. If the message type is an ACK, it is updated in
	 * {@link chunkAcksRef}. If {@link onMessage} is provided, it is called with the same properties this function was
	 * called with.
	 * @param ev The event which triggered this function.
	 */
	function handleMessage(this: WebSocket, ev: MessageEvent<string>) {
		onMessage?.(this, ev);

		const { chunkIndex, type } = parseChunkMetadata(ev.data);
		if (type === 'ACK') {
			chunkAcksRef.current[chunkIndex] = { acked: true, timestamp: Date.now() };
		}
	}

	/**
	 * Handler function that handles what should happen when an exception occurs within a WebSocket session. A maximum of
	 * {@link connectRetryLimit} attempts to reconnect are made. If a connection cannot be re-obtained by the time this
	 * limit is reached, the connection is closed. If {@link onError} is provided, it is called with the same properties
	 * this function was called with.
	 * @param ev The event which triggered this function.
	 */
	function handleError(this: WebSocket, ev: Event) {
		// Run onError if provided
		onError?.(this, ev);

		const retryLimitStr = (connectRetryLimit + 1).toString();
		const retryCountStr = (connectRetryCountRef.current + 1).toString();

		// If retry limit is exceeded, throw error
		if (connectRetryCountRef.current >= connectRetryLimit) {
			connectPromiseRef.current?.reject(
				new Error(
					`${generateLogPrefix()} - Connection retry limit reached (${retryLimitStr} / ${retryLimitStr}), aborting...`
				)
			);
			connectPromiseRef.current = null;
			return;
		}
		// Else, try again
		console.debug(
			`${generateLogPrefix()} - Connection failed (attempt ${retryCountStr} / ${retryLimitStr}), retrying...`
		);
	}

	/**
	 * Handler function that handles what should happen when a WebSocket session is closed. If the session was not closed
	 * gracefully, a maximum of {@link connectRetryLimit} attempts to reconnect are made. If a connection cannot be
	 * re-obtained by the time this limit is reached, the connection is closed. If {@link onClose} is provided, it is
	 * called with the same properties which this function was called with.
	 * @param ev The event which triggered this function.
	 */
	function handleClose(this: WebSocket, ev: CloseEvent) {
		// Run onClose if provided
		onClose?.(this, ev);

		// Clear ref
		wsRef.current = null;
		setIsConnected(false);

		// Check if reconnect is required
		const shouldRetry =
			!manuallyClosedRef.current &&
			connectRetryOnClose &&
			!ev.wasClean &&
			connectRetryCountRef.current < connectRetryLimit;

		// Attempt to reconnect if required
		if (shouldRetry) {
			connectRetryCountRef.current++;
			setTimeout(attemptConnect, connectRetryTimeoutMs);
		} else if (connectPromiseRef.current) {
			connectPromiseRef.current.reject(new Error('WebSocket connection closed before connection could be established'));
			connectPromiseRef.current = null;
		} else {
			console.debug(`${generateLogPrefix()} - Connection terminated.`);
		}
	}

	return {
		ws: wsRef.current,
		isConnected,
		connect,
		disconnect,
		send,
		sendFile,
	};
}

export default useWebSocket;
