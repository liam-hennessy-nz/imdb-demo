import axios from 'axios';
import { newErrorWrap, parseAxiosError } from '../util/commonFunctions.ts';

export async function GET<T>(url: URL, abortSignal?: AbortSignal) {
	try {
		return (await axios.get<T>(url.toString(), { signal: abortSignal })).data;
	} catch (ex) {
		throw newErrorWrap(parseAxiosError(ex), ex);
	}
}

export async function POST<T>(url: URL, data?: unknown, abortSignal?: AbortSignal) {
	try {
		return (await axios.post<T>(url.toString(), data, { signal: abortSignal })).data;
	} catch (ex) {
		throw newErrorWrap(parseAxiosError(ex), ex);
	}
}

export async function PUT<T>(url: URL, data?: unknown, abortSignal?: AbortSignal) {
	try {
		return (await axios.put<T>(url.toString(), data, { signal: abortSignal })).data;
	} catch (ex) {
		throw newErrorWrap(parseAxiosError(ex), ex);
	}
}

export async function DELETE(url: URL, abortSignal?: AbortSignal) {
	try {
		await axios.delete(url.toString(), { signal: abortSignal });
	} catch (ex) {
		throw newErrorWrap(parseAxiosError(ex), ex);
	}
}
