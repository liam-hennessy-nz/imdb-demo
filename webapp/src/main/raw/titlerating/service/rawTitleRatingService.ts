import { ENDPOINT } from '../../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../../shared/util/commonFunctions.ts';
import type { RawTitleRating } from '../entity/RawTitleRating.ts';

const basePath = `${ENDPOINT.API}/raw/title_basic`;

export async function getRawTitleRatingPage(request: PageRequest, abortSignal?: AbortSignal) {
	const url = new URL(basePath);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<RawTitleRating>>(url, abortSignal);
}

export async function getRawTitleRatingById(id: number, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/${id}`);
	return await GET<RawTitleRating>(url, abortSignal);
}

export async function getRawTitleRatingByTconst(tconst: string, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/tconst/${tconst}`);
	return await GET<RawTitleRating>(url, abortSignal);
}
