/**
 * Function parses an unknown object into an Error message string.
 * @param ex The unknown object.
 * @return If the object is an Error: the Error message. Else: 'Unknown error'.
 */
export function parseErrorMessage(ex: unknown) {
	if (ex instanceof Error && ex.message !== '') {
		return ex.message;
	} else {
		return 'Unknown error';
	}
}

/**
 * Function parses an unknown object into an Error.
 * @param ex The unknown object.
 * @return If the object is an Error: the Error. Else: A new Error with message 'Unknown error'.
 */
export function parseError(ex: unknown) {
	if (ex instanceof Error) {
		return ex;
	} else {
		return new Error('Unknown error');
	}
}

/**
 * Function awaits for the specified time.
 * @param ms Time to wait in milliseconds.
 */
export async function sleep(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitForCondition(
	doResolve: () => boolean,
	options: { timeoutMs: number; intervalMs: number; doReject?: () => Error | null }
) {
	return new Promise<void>((resolve, reject) => {
		let settled = false;

		function cleanup() {
			clearTimeout(timeout);
			clearInterval(interval);
		}

		const timeout = setTimeout(() => {
			if (settled) return;

			settled = true;
			cleanup();
			reject(new Error(`Timed out after ${options.timeoutMs}ms`));
		}, options.timeoutMs);

		const interval = setInterval(() => {
			if (settled) return;

			const rejection = options.doReject?.();
			if (rejection !== undefined && rejection !== null) {
				settled = true;
				cleanup();
				reject(rejection);
				return;
			}

			if (doResolve()) {
				settled = true;
				cleanup();
				resolve();
			}
		}, options.intervalMs);
	});
}

export function test(
	doResolve: boolean,
	doReject: boolean,
	timeoutMs: number,
	intervalMs: number,
	resolve: () => void,
	reject: (reason: Error) => void
) {
	let settled = false;

	const timeout = setTimeout(() => {
		if (!settled) {
			settled = true;
			cleanup();
			reject(new Error('Timed out'));
			return;
		}
	}, timeoutMs);

	const interval = setInterval(() => {
		if (settled) return;

		if (doReject) {
			settled = true;
			cleanup();
			reject(new Error('Timed out'));
			return;
		}
		if (doResolve) {
			settled = true;
			cleanup();
			resolve();
			return;
		}
	}, intervalMs);

	function cleanup() {
		clearTimeout(timeout);
		clearInterval(interval);
	}
}
