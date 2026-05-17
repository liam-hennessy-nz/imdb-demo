import { ENDPOINT } from '../../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../../shared/util/commonFunctions.ts';
import type { RawTitlePrincipal } from '../entity/RawTitlePrincipal.ts';

const basePath = `${ENDPOINT.API}/raw/title_principal`;

export async function getRawTitlePrincipalPage(request: PageRequest, abortSignal?: AbortSignal) {
	const url = new URL(basePath);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<RawTitlePrincipal>>(url, abortSignal);
}

export async function getRawTitlePrincipalById(id: number, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/${id}`);
	return await GET<RawTitlePrincipal>(url, abortSignal);
}

export async function getRawTitlePrincipalByTconst(tconst: string, abortSignal?: AbortSignal) {
	const url = new URL(`${basePath}/tconst/${tconst}`);
	return await GET<RawTitlePrincipal>(url, abortSignal);
}
