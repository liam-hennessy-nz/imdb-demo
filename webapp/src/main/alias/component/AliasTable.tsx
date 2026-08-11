import Box from '@mui/material/Box';
import { CustomTable } from '../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import { getAliasPage } from '../service/AliasService.ts';

export function AliasTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getAliasPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="alias" onPage={handlePage} />
		</Box>
	);
}
