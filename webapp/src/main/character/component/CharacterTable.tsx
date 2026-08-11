import Box from '@mui/material/Box';
import { CustomTable } from '../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import { getCharacterPage } from '../service/CharacterService.ts';

export function CharacterTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getCharacterPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="character" onPage={handlePage} />
		</Box>
	);
}
