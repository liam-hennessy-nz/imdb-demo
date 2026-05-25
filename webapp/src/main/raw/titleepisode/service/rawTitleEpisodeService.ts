import { ENDPOINT } from '../../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../../shared/util/commonFunctions.ts';
import type { RawTitleEpisode } from '../entity/RawTitleEpisode.ts';

const basePath = `${ENDPOINT.API}/raw/title_episode`;

export async function getRawTitleEpisodePage(request: PageRequest, abortSignal?: AbortSignal) {
	const url = new URL(basePath);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<RawTitleEpisode>>(url, abortSignal);
}

export async function getRawTitleEpisodeById(id: number, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/${id}`);
	return await GET<RawTitleEpisode>(url, abortSignal);
}

export async function getRawTitleEpisodeByTconst(tconst: string, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/tconst/${tconst}`);
	return await GET<RawTitleEpisode>(url, abortSignal);
}
