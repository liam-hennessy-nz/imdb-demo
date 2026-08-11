import { ENDPOINT } from '../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../shared/util/commonFunctions.ts';
import type { TitleModel } from '../model/TitleModel.ts';

const baseUrl = `${ENDPOINT.API}/title`;

export async function getTitlePage(request: PageRequest, abortSignal: AbortSignal) {
	const url = new URL(baseUrl);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<TitleModel>>(url, abortSignal);
}

export async function getTitleById(id: number, abortSignal: AbortSignal) {
	const url = new URL(`${baseUrl}/${id}`);
	return await GET<TitleModel>(url, abortSignal);
}
