export function openWebSocket(url: string): Promise<WebSocket> {
	let attempts = 0;
	const maxAttempts = 5;
	const retryDelay = 1000;

	return new Promise<WebSocket>((resolve, reject) => {
		function connect() {
			const socket = new WebSocket(url);

			socket.onopen = () => {
				console.debug(`WebSocket [${url}] opened`);
				resolve(socket);
			};

			socket.onerror = (e) => {
				console.debug(`WebSocket [${url}] error:`, e);
				// Don't reject here; allow retry after close
				socket.close();
			};

			socket.onclose = () => {
				attempts++;
				if (attempts < maxAttempts) {
					console.debug(`WebSocket [${url}] closed, retrying (attempt ${attempts.toString()})`);
					setTimeout(connect, retryDelay);
				} else {
					reject(new Error(`WebSocket [${url}] failed to connect after ${maxAttempts.toString()} attempts`));
				}
			};
		}

		connect();
	});
}
