import axios, { type AxiosRequestConfig } from 'axios';
import { ENDPOINT } from '../constant/endpoint.ts';
import { newErrorWrap, parseErrorMessage } from '../util/commonFunctions.ts';

export async function GET<T>(path: string) {
	try {
		return (await axios.get<T>(`${ENDPOINT.API}/${path}`)).data;
	} catch (ex) {
		throw newErrorWrap(parseAxiosErrorMessage(ex), ex);
	}
}

export async function POST<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
	try {
		return (await axios.post<T>(`${ENDPOINT.API}/${path}`, data, config)).data;
	} catch (ex) {
		throw newErrorWrap(parseAxiosErrorMessage(ex), ex);
	}
}

export async function PUT<T>(path: string, data?: unknown) {
	try {
		return (await axios.put<T>(`${ENDPOINT.API}/${path}`, data)).data;
	} catch (ex) {
		throw newErrorWrap(parseAxiosErrorMessage(ex), ex);
	}
}

export async function DELETE(path: string) {
	try {
		await axios.delete(`${ENDPOINT.API}/${path}`);
	} catch (ex) {
		throw newErrorWrap(parseAxiosErrorMessage(ex), ex);
	}
}

function parseAxiosErrorMessage(ex: unknown) {
	if (axios.isAxiosError(ex)) {
		const status = ex.response !== undefined ? ` [${ex.response.status.toString()}]` : '';
		return `Axios error${status}: ${ex.message !== '' ? ex.message : 'Unknown error'}`;
	} else {
		return parseErrorMessage(ex);
	}
}
