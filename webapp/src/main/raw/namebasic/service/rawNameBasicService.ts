import { ENDPOINT } from '../../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../../shared/util/commonFunctions.ts';
import type { RawNameBasic } from '../entity/RawNameBasic.ts';

const basePath = `${ENDPOINT.API}/raw/name_basic`;

export async function getRawNameBasicPage(request: PageRequest, abortSignal?: AbortSignal) {
	const url = new URL(basePath);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<RawNameBasic>>(url, abortSignal);
}

export async function getRawNameBasicById(id: number, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/${id}`);
	return await GET<RawNameBasic>(url, abortSignal);
}

export async function getRawNameBasicByNconst(nconst: string, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/nconst/${nconst}`);
	return await GET<RawNameBasic>(url, abortSignal);
}
