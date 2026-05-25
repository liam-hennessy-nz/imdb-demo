import { ENDPOINT } from '../../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../../shared/util/commonFunctions.ts';
import type { RawTitleBasic } from '../entity/RawTitleBasic.ts';

const basePath = `${ENDPOINT.API}/raw/title_basic`;

export async function getRawTitleBasicPage(request: PageRequest, abortSignal?: AbortSignal) {
	const url = new URL(basePath);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<RawTitleBasic>>(url, abortSignal);
}

export async function getRawTitleBasicById(id: number, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/${id}`);
	return await GET<RawTitleBasic>(url, abortSignal);
}

export async function getRawTitleBasicByTconst(tconst: string, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/tconst/${tconst}`);
	return await GET<RawTitleBasic>(url, abortSignal);
}
