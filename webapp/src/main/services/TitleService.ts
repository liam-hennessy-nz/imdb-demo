import { GET } from './RequestService';
import type { Title } from '../entities/Title';

const basePath = 'title';

export async function getTitles() {
	return await GET<Title[]>(`${basePath}/`);
}

export async function getTitleById(id: number) {
	return await GET(`${basePath}/${id.toString()}`);
}
