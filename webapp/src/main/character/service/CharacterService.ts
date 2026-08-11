import { ENDPOINT } from '../../shared/constant/endpoint.ts';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import type { PageResponseDTO } from '../../shared/dto/PageResponseDTO.ts';
import { GET } from '../../shared/service/requestService.ts';
import { toUrlSearchParams } from '../../shared/util/commonFunctions.ts';
import type { CharacterModel } from '../model/CharacterModel.ts';

const baseUrl = `${ENDPOINT.API}/character`;

export async function getCharacterPage(request: PageRequest, abortSignal: AbortSignal) {
	const url = new URL(baseUrl);
	url.search = toUrlSearchParams(request).toString();
	return await GET<PageResponseDTO<CharacterModel>>(url, abortSignal);
}

export async function getCharacterById(id: number, abortSignal: AbortSignal) {
	const url = new URL(`${baseUrl}/${id}`);
	return await GET<CharacterModel>(url, abortSignal);
}
