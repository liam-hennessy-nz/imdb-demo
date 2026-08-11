import { ENDPOINT } from '../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../shared/util/commonFunctions.ts';
import type { AliasModel } from '../model/AliasModel.ts';

const baseUrl = `${ENDPOINT.API}/alias`;

export async function getAliasPage(request: PageRequest, abortSignal: AbortSignal) {
	const url = new URL(baseUrl);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<AliasModel>>(url, abortSignal);
}

export async function getAliasById(id: number, abortSignal: AbortSignal) {
	const url = new URL(`${baseUrl}/${id}`);
	return await GET<AliasModel>(url, abortSignal);
}
