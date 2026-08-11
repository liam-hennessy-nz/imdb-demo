import { ENDPOINT } from '../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../shared/util/commonFunctions.ts';
import type { ProfessionModel } from '../model/ProfessionModel.ts';

const baseUrl = `${ENDPOINT.API}/profession`;

export async function getProfessionPage(request: PageRequest, abortSignal: AbortSignal) {
	const url = new URL(baseUrl);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<ProfessionModel>>(url, abortSignal);
}

export async function getProfessionById(id: number, abortSignal: AbortSignal) {
	const url = new URL(`${baseUrl}/${id}`);
	return await GET<ProfessionModel>(url, abortSignal);
}
