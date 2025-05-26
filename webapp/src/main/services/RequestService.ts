import axios, { type AxiosRequestConfig } from 'axios';
import { API } from '../constants/api';
import { parseErrorMessage } from '../common/CommonFunctions.ts';

export async function GET<T>(path: string) {
	try {
		return (await axios.get<T>(`${API.BASE_URL}/${path}`)).data;
	} catch (e) {
		throw new Error(parseAxiosError(e));
	}
}

export async function POST<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
	try {
		return (await axios.post<T>(`${API.BASE_URL}/${path}`, data, config)).data;
	} catch (e) {
		throw new Error(parseAxiosError(e));
	}
}

export async function PUT<T>(path: string, data?: unknown) {
	try {
		return (await axios.put<T>(`${API.BASE_URL}/${path}`, data)).data;
	} catch (e) {
		throw new Error(parseAxiosError(e));
	}
}

export async function DELETE(path: string) {
	try {
		await axios.delete(`${API.BASE_URL}/${path}`);
	} catch (e) {
		throw new Error(parseAxiosError(e));
	}
}

function parseAxiosError(e: unknown) {
	if (axios.isAxiosError(e)) {
		const status = e.response ? ` [${e.response.status.toString()}]` : '';
		return `Axios error${status}: ${e.message || 'Unknown error'}`;
	} else {
		return parseErrorMessage(e);
	}
}
