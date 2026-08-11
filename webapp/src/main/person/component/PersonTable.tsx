import Box from '@mui/material/Box';
import { CustomTable } from '../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import { getPersonPage } from '../service/PersonService.ts';

export function PersonTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getPersonPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="person" onPage={handlePage} />
		</Box>
	);
}
