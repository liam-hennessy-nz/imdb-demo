import Box from '@mui/material/Box';
import { CustomTable } from '../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import { getProfessionPage } from '../service/ProfessionService.ts';

export function ProfessionTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getProfessionPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="profession" onPage={handlePage} />
		</Box>
	);
}
