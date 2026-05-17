import axios from 'axios';
import type { PageRequest } from '../dto/PageRequest.ts';

/**
 * Function parses an unknown object into an Error message string.
 * @param ex The unknown object.
 * @return If the object is an Error: the Error message.
 *
 * Else: 'Unknown error'.
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
 * @return If the object is an Error: the Error.
 *
 * Else: A new Error with the message 'Unknown error' followed by the object in string form.
 */
export function parseError(ex: unknown) {
	if (ex instanceof Error) {
		return ex;
	} else {
		return new Error(`Unknown error: '${String(ex)}'`);
	}
}

export function parseAxiosError(ex: unknown) {
	if (axios.isAxiosError(ex)) {
		const status = ex.response !== undefined ? ` [${ex.response.status.toString()}]` : '';
		return `Axios error${status}: ${ex.message !== '' ? ex.message : 'Unknown error'}`;
	} else {
		return parseErrorMessage(ex);
	}
}

export function isAbortError(ex: unknown) {
	return ex instanceof Error && axios.isAxiosError(ex.cause) && ex.cause.code === 'ERR_CANCELED';
}

/**
 * Function parses an unknown object into the cause of a new Error with a message.
 * @param message Message to use in the new Error.
 * @param cause The unknown object.
 * @return A new Error with the parsed Error as the cause.
 */
export function newErrorWrap(message: string, cause: unknown) {
	return new Error(message, { cause: parseError(cause) });
}

export function formatBytes(bytes: number, decimals = 2) {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function toUrlSearchParams(request: PageRequest) {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set('page', request.pagination.page.toString());
	urlSearchParams.set('size', request.pagination.pageSize.toString());

	for (const sort of request.sort) {
		if (sort.sort === undefined || sort.sort === null) continue;
		urlSearchParams.append('sort', `${sort.field},${sort.sort}`);
	}

	for (const filter of request.filter.items) {
		if (
			filter.operator !== 'isEmpty' &&
			filter.operator !== 'isNotEmpty' &&
			(filter.value === undefined || filter.value === null)
		) {
			continue;
		}
		urlSearchParams.append(`${filter.field}[${filter.operator}]`, String(filter.value));
	}

	return urlSearchParams;
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
	options: { timeoutMs?: number; pollIntervalMs?: number; doReject?: () => Error | null }
) {
	return new Promise<void>((resolve, reject) => {
		let settled = false;
		let timeout: number;

		function cleanup() {
			if (options.timeoutMs !== undefined) {
				clearTimeout(timeout);
			}
			clearInterval(interval);
		}

		if (options.timeoutMs !== undefined) {
			timeout = setTimeout(() => {
				if (settled) return;

				settled = true;
				cleanup();
				reject(new Error(`Timed out after ${options.timeoutMs}ms`));
			}, options.timeoutMs);
		}

		const interval = setInterval(() => {
			if (settled) return;

			if (options.doReject !== undefined) {
				const rejection = options.doReject();
				if (rejection !== null) {
					settled = true;
					cleanup();
					reject(rejection);
					return;
				}
			}

			if (doResolve()) {
				settled = true;
				cleanup();
				resolve();
			}
		}, options.pollIntervalMs ?? 50);
	});
}
