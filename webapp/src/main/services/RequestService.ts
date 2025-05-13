import axios, { type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/api';

export async function GET<T>(path: string) {
	return (await axios.get<T>(`${API_BASE_URL}/${path}`)).data;
}

export async function POST<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
	return (await axios.post<T>(`${API_BASE_URL}/${path}`, data, config)).data;
}

export async function PUT<T>(path: string, data?: unknown) {
	return (await axios.put<T>(`${API_BASE_URL}/${path}`, data)).data;
}

export async function DELETE(path: string) {
	await axios.delete(`${API_BASE_URL}/${path}`);
}
