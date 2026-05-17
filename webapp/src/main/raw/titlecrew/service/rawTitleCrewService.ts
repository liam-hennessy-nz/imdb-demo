import { ENDPOINT } from '../../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../../shared/util/commonFunctions.ts';
import type { RawTitleCrew } from '../entity/RawTitleCrew.ts';

const basePath = `${ENDPOINT.API}/raw/title_crew`;

export async function getRawTitleCrewPage(request: PageRequest, abortSignal?: AbortSignal) {
	const url = new URL(basePath);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<RawTitleCrew>>(url, abortSignal);
}

export async function getRawTitleCrewById(id: number, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/${id}`);
	return await GET<RawTitleCrew>(url, abortSignal);
}

export async function getRawTitleCrewByTconst(tconst: string, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/tconst/${tconst}`);
	return await GET<RawTitleCrew>(url, abortSignal);
}
