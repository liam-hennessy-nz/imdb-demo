import { GET } from '../../shared/service/requestService.ts';
import type { Title } from '../entity/Title.ts';

const basePath = 'title';

export async function getTitles() {
	return await GET<Title[]>(`${basePath}/`);
}

export async function getTitleById(id: number) {
	return await GET(`${basePath}/${id.toString()}`);
}
