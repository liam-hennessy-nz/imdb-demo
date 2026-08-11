import Box from '@mui/material/Box';
import { CustomTable } from '../../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import { getRawTitleBasicPage } from '../service/rawTitleBasicService.ts';

export function RawTitleBasicTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getRawTitleBasicPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="rawTitleBasic" onPage={handlePage} getRowId={(row) => row.tconst} />
		</Box>
	);
}
