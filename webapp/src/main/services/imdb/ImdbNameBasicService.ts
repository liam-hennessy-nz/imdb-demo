import { GET, POST } from '../RequestService.ts';
import type { ImdbNameBasic } from '../../entities/imdb/ImdbNameBasic.ts';
import type { PageResponse } from '../../entities/PageResponse.ts';
import type { FilterRequest } from '../../entities/FilterRequest.ts';

const basePath = 'imdb/name_basic';

export async function getImdbNameBasicById(id: number) {
	return await GET<ImdbNameBasic>(`${basePath}/${id.toString()}`);
}

export async function getImdbNameBasicByNconst(nconst: string) {
	return await GET<ImdbNameBasic>(`${basePath}/nconst/${nconst}`);
}

export async function pageImdbNameBasics(page?: number, size?: number) {
	const params = new URLSearchParams({
		page: page?.toString() ?? '0',
		size: size?.toString() ?? '10',
	});

	return await GET<PageResponse<ImdbNameBasic>>(`${basePath}/?${params}`);
}

export async function filterImdbNameBasics(request: FilterRequest) {
	return await POST<PageResponse<ImdbNameBasic>>(`${basePath}/filter`, request);
}
