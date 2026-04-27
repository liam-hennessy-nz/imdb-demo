import { WEBSOCKET } from '../constant/constants.ts';
import { parseErrorMessage, sleep } from './commonFunctions.ts';
import { devLog } from './devLog.ts';

type ConnectStatus = 'open' | 'disconnected' | 'closed';

interface Callbacks {
	onOpen?: (ev: Event) => void;
	onMessage?: (ev: MessageEvent<string>) => void;
	onClose?: (ev: CloseEvent) => void;
	onError?: (ex: Event) => void;
}

interface WebSocketProps {
	url: URL;
	connectMaxAttempts?: number;
	connectTimeoutMs?: number;
	doRetryOnConnectFail?: boolean;
	sendMaxAttempts?: number;
	sendTimeoutMs?: number;
	doRetryOnSendFail?: boolean;
	callbacks?: Callbacks;
}

export interface WebSocketState {
	socket: WebSocket | null;
	open: (maxAttempts?: number) => Promise<void>;
	send: (data: string | ArrayBufferLike, maxAttempts?: number) => Promise<void>;
	close: () => void;
	getConnectStatus: () => ConnectStatus;
}

export function initWebSocket(props: WebSocketProps): WebSocketState {
	const {
		url,
		callbacks,
		connectMaxAttempts = WEBSOCKET.CONNECT.MAX_ATTEMPTS,
		connectTimeoutMs = WEBSOCKET.CONNECT.TIMEOUT_MS,
		doRetryOnConnectFail = true,
		sendMaxAttempts = WEBSOCKET.SEND.MAX_ATTEMPTS,
		sendTimeoutMs = WEBSOCKET.SEND.TIMEOUT_MS,
		doRetryOnSendFail = true,
	} = props;

	let socket: WebSocket | null = null;
	let isClosed = false;

	async function send(data: string | ArrayBufferLike, maxAttempts = doRetryOnSendFail ? sendMaxAttempts : 1) {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				if (socket?.readyState !== WebSocket.OPEN) {
					devLog.debug(`WebSocket not open, connecting...`);
					await open(1);
				}
				if (socket?.readyState === WebSocket.OPEN) {
					devLog.debug('Sending:', data);
					socket.send(data);
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

	async function init() {
		return new Promise<void>((resolve, reject) => {
			if (getConnectStatus() === 'open' && socket?.readyState === WebSocket.OPEN) {
				resolve();
				return;
			}

			socket = new WebSocket(url);

			const timeout = setTimeout(() => {
				close();
				reject(new Error(`Waiting for WebSocket connection timed out after ${connectTimeoutMs}ms`));
			}, connectTimeoutMs);

			socket.onopen = (ev: Event) => {
				clearTimeout(timeout);
				resolve();
				devLog.debug('WebSocket connection established');
				callbacks?.onOpen?.(ev);
			};

			socket.onmessage = (ev: MessageEvent<string>) => {
				callbacks?.onMessage?.(ev);
			};

			socket.onerror = (ev: Event) => {
				clearTimeout(timeout);
				reject(new Error('WebSocket connection failed'));
				callbacks?.onError?.(ev);
			};

			socket.onclose = async (ev: CloseEvent) => {
				socket = null;

				if (!ev.wasClean) {
					if (getConnectStatus() !== 'closed' && doRetryOnConnectFail) {
						devLog.warn('WebSocket connection terminated prematurely, reconnecting...');
						try {
							await open();
							return;
						} catch (ex) {
							devLog.error(`WebSocket connection failed to reconnect: ${parseErrorMessage(ex)}`);
						}
					} else {
						devLog.debug('WebSocket connection terminated prematurely, not attempting to reconnect');
					}
				} else {
					devLog.info('WebSocket connection closed OK');
				}
				callbacks?.onClose?.(ev);
			};
		});
	}

	async function open(maxAttempts = doRetryOnConnectFail ? connectMaxAttempts : 1) {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				await init();
				return;
			} catch (ex) {
				if (attempt < maxAttempts) {
					devLog.debug(`Connect failed: ${parseErrorMessage(ex)}, retrying (${attempt} / ${maxAttempts})...`);
				}
			}
		}
		close();
		throw new Error(maxAttempts > 1 ? `Max connect attempts reached (${maxAttempts})` : 'Connect failed');
	}

	function close() {
		socket?.close();
		socket = null;
		isClosed = true;
	}

	function getConnectStatus(): ConnectStatus {
		if (socket?.readyState === WebSocket.OPEN) {
			return 'open';
		} else if (isClosed) {
			return 'closed';
		} else {
			return 'disconnected';
		}
	}

	return { socket, open, send, close, getConnectStatus };
}
