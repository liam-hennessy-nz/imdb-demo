import { ENDPOINT } from '../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../shared/util/commonFunctions.ts';
import type { GenreModel } from '../model/GenreModel.ts';

const baseUrl = `${ENDPOINT.API}/genre`;

export async function getGenrePage(request: PageRequest, abortSignal: AbortSignal) {
	const url = new URL(baseUrl);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<GenreModel>>(url, abortSignal);
}

export async function getGenreById(id: number, abortSignal: AbortSignal) {
	const url = new URL(`${baseUrl}/${id}`);
	return await GET<GenreModel>(url, abortSignal);
}
