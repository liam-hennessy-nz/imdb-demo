import Box from '@mui/material/Box';
import { CustomTable } from '../../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import { getRawTitlePrincipalPage } from '../service/rawTitlePrincipalService.ts';

export function RawTitlePrincipalTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getRawTitlePrincipalPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="rawTitlePrincipal" onPage={handlePage} getRowId={(row) => row.tconst} />
		</Box>
	);
}
