import Box from '@mui/material/Box';
import { CustomTable } from '../../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import { getRawTitleAkaPage } from '../service/rawTitleAkaService.ts';

export function RawTitleAkaTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getRawTitleAkaPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="rawTitleAka" onPage={handlePage} getRowId={(row) => row.tconst} />
		</Box>
	);
}
