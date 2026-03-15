import { useEffect, useRef, useState, type RefObject } from 'react';
import { parseErrorMessage, sleep } from '../shared/commonFunctions.ts';
import { WEBSOCKET } from '../shared/constant/constants.ts';
import { devLog } from '../shared/util/devLog.ts';

interface useWebSocketProps {
	url: string;
	connectMaxAttempts?: number;
	connectTimeoutMs?: number;
	doRetryOnConnectFail?: boolean;
	sendMaxAttempts?: number;
	sendTimeoutMs?: number;
	doRetryOnSendFail?: boolean;
	onOpen?: (ev: Event) => void;
	onMessage?: (ev: MessageEvent) => void;
	onError?: (ev: Event) => void;
	onClose?: (ev: CloseEvent) => void;
}

type ConnectStatus = 'disconnected' | 'connecting' | 'connected' | null;

interface WebSocketState {
	wsRef: RefObject<WebSocket | null>;
	connect: (maxAttempts?: number) => Promise<void>;
	send: (data: string | ArrayBufferLike, maxAttempts?: number) => Promise<void>;
	disconnect: () => void;
	connectStatus: ConnectStatus;
}

export function useWebSocket(props: useWebSocketProps): WebSocketState {
	const {
		url,
		connectMaxAttempts = WEBSOCKET.CONNECT.MAX_ATTEMPTS,
		connectTimeoutMs = WEBSOCKET.CONNECT.TIMEOUT_MS,
		doRetryOnConnectFail = true,
		sendMaxAttempts = WEBSOCKET.SEND.MAX_ATTEMPTS,
		sendTimeoutMs = WEBSOCKET.SEND.TIMEOUT_MS,
		doRetryOnSendFail = true,
		onOpen,
		onMessage,
		onError,
		onClose,
	} = props;

	const wsRef = useRef<WebSocket | null>(null);
	const [connectStatus, setConnectStatus] = useState<ConnectStatus>(null);

	/**
	 * Function which sends data over an established WebSocket connection. If no connection is active, attempt to
	 * establish a new connection.
	 *
	 * If no connection is established and/or the data fails to send before {@link sendMaxAttempts} is reached, the
	 * function, and any existing WebSocket connection, is terminated.
	 *
	 * @param data The payload, a string or an ArrayBuffer chunk, to be sent through to the backend.
	 * @param maxAttempts Optional parameter that can be used to override {@link sendMaxAttempts} to control how many
	 * failed send attempts can occur before throwing an Error. This will also default to 1 if {@link doRetryOnSendFail}
	 * is set to false.
	 *
	 * @throws Error if no successful send occurs after {@link maxAttempts} retries.
	 */
	async function send(data: string | ArrayBufferLike, maxAttempts = doRetryOnSendFail ? sendMaxAttempts : 1) {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				if (wsRef.current?.readyState !== WebSocket.OPEN) {
					devLog.debug(`WebSocket not open, connecting...`);
					await connect(1);
				}
				if (wsRef.current?.readyState === WebSocket.OPEN) {
					devLog.debug('Sending:', data);
					wsRef.current.send(data);
					return;
				}
			} catch (ex) {
				if (attempt < maxAttempts) {
					devLog.warn(`Send failed: ${parseErrorMessage(ex)}, retrying (${attempt} / ${maxAttempts})...`);
					await sleep(sendTimeoutMs);
				}
			}
		}
		throw new Error(maxAttempts > 1 ? `Max send attempts reached (${maxAttempts})` : 'Send failed');
	}

	/**
	 * Function that attempts to establish a WebSocket connection with the backend. It also initialises listeners for
	 * onopen, onmessage, onerror and onclose. It will return a resolved promise if a connection is established, and a
	 * rejected promise if an error occurs or no connection is made before {@link connectTimeoutMs} is reached.
	 */
	function initSocket() {
		return new Promise<void>((resolve, reject) => {
			setConnectStatus('connecting');

			if (wsRef.current !== null) {
				setConnectStatus('connected');
				resolve();
				return;
			}

			const ws = new WebSocket(url);
			wsRef.current = ws;

			const timeout = setTimeout(() => {
				disconnect();
				reject(new Error(`Waiting for WebSocket connection timed out after ${connectTimeoutMs}ms`));
			}, connectTimeoutMs);

			ws.onopen = handleOpen;
			ws.onmessage = handleMessage;
			ws.onerror = handleError;
			ws.onclose = async (ev: CloseEvent) => {
				await handleClose(ev);
			};

			function handleOpen(ev: Event) {
				clearTimeout(timeout);
				setConnectStatus('connected');
				resolve();
				devLog.debug('WebSocket connection established');
				onOpen?.(ev);
			}

			function handleMessage(ev: MessageEvent<string>) {
				onMessage?.(ev);
			}

			function handleError(ev: Event) {
				clearTimeout(timeout);
				reject(new Error('WebSocket connection failed'));
				onError?.(ev);
			}

			async function handleClose(ev: CloseEvent) {
				wsRef.current = null;

				if (!ev.wasClean) {
					if (connectStatus !== 'disconnected' && doRetryOnConnectFail) {
						devLog.warn('WebSocket connection terminated early, reconnecting...');
						try {
							await connect();
							return;
						} catch (ex) {
							devLog.error(`WebSocket connection failed to reconnect: ${parseErrorMessage(ex)}`);
						}
					} else {
						devLog.debug('WebSocket connection terminated early, not attempting to reconnect');
					}
				} else {
					devLog.info('WebSocket connection closed OK');
				}
				onClose?.(ev);
			}
		});
	}

	/**
	 * Function that acts as a wrapper for {@link initSocket}, allowing for multiple attempts.
	 *
	 * @param maxAttempts Optional parameter that can be used to override {@link connectMaxAttempts} to control how many
	 * failed connect attempts can occur before throwing an Error. This will also default to 1 if
	 * {@link doRetryOnConnectFail} is set to false.
	 *
	 * @throws Error if no successful connect occurs after {@link maxAttempts} retries.
	 */
	async function connect(maxAttempts = doRetryOnConnectFail ? connectMaxAttempts : 1) {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				await initSocket();
				return;
			} catch (ex) {
				if (attempt < maxAttempts) {
					devLog.debug(`Connect failed: ${parseErrorMessage(ex)}, retrying (${attempt} / ${maxAttempts})...`);
				}
			}
		}
		disconnect();
		throw new Error(maxAttempts > 1 ? `Max connect attempts reached (${maxAttempts})` : 'Connect failed');
	}

	/**
	 * Function which closes the existing WebSocket connection and clears all refs.
	 */
	function disconnect() {
		wsRef.current?.close();
		wsRef.current = null;
		setConnectStatus('disconnected');
	}

	useEffect(() => {
		return () => {
			disconnect();
		};
	}, []);

	return { wsRef, connect, send, disconnect, connectStatus };
}
