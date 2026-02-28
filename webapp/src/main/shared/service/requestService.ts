import axios, { type AxiosRequestConfig } from 'axios';
import { parseErrorMessage } from '../commonFunctions.ts';
import { API } from '../constant/api.ts';

export async function GET<T>(path: string) {
	try {
		return (await axios.get<T>(`${API.BASE_URL}/${path}`)).data;
	} catch (ex) {
		throw new Error(parseAxiosError(ex));
	}
}

export async function POST<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
	try {
		return (await axios.post<T>(`${API.BASE_URL}/${path}`, data, config)).data;
	} catch (ex) {
		throw new Error(parseAxiosError(ex));
	}
}

export async function PUT<T>(path: string, data?: unknown) {
	try {
		return (await axios.put<T>(`${API.BASE_URL}/${path}`, data)).data;
	} catch (ex) {
		throw new Error(parseAxiosError(ex));
	}
}

export async function DELETE(path: string) {
	try {
		await axios.delete(`${API.BASE_URL}/${path}`);
	} catch (ex) {
		throw new Error(parseAxiosError(ex));
	}
}

function parseAxiosError(ex: unknown) {
	if (axios.isAxiosError(ex)) {
		const status = ex.response !== undefined ? ` [${ex.response.status.toString()}]` : '';
		return `Axios error ${status}: ${ex.message !== '' ? ex.message : 'Unknown error'}`;
	} else {
		return parseErrorMessage(ex);
	}
}
