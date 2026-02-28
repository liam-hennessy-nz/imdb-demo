import type { FilterRequest } from '../../shared/entity/FilterRequest.ts';
import type { PageResponse } from '../../shared/entity/PageResponse.ts';
import { GET, POST } from '../../shared/service/requestService.ts';
import type { RawNameBasic } from '../entity/RawNameBasic.ts';

const basePath = 'imdb/name_basic';

export async function getImdbNameBasicById(id: number) {
	return await GET<RawNameBasic>(`${basePath}/${id.toString()}`);
}

export async function getImdbNameBasicByNconst(nconst: string) {
	return await GET<RawNameBasic>(`${basePath}/nconst/${nconst}`);
}

export async function pageImdbNameBasics(page?: number, size?: number) {
	const params = new URLSearchParams({
		page: page?.toString() ?? '0',
		size: size?.toString() ?? '10',
	});

	return await GET<PageResponse<RawNameBasic>>(`${basePath}/?${params}`);
}

export async function filterImdbNameBasics(request: FilterRequest) {
	return await POST<PageResponse<RawNameBasic>>(`${basePath}/filter`, request);
}
