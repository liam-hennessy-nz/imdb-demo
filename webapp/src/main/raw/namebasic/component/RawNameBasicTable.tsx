import Box from '@mui/material/Box';
import { CustomTable } from '../../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import { getRawNameBasicPage } from '../service/rawNameBasicService.ts';

export function RawNameBasicTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getRawNameBasicPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="rawNameBasic" onPage={handlePage} getRowId={(row) => row.nconst} />
		</Box>
	);
}
