import Box from '@mui/material/Box';
import { CustomTable } from '../../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import { getRawTitleRatingPage } from '../service/rawTitleRatingService.ts';

export function RawTitleRatingTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getRawTitleRatingPage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="rawTitleRating" onPage={handlePage} getRowId={(row) => row.tconst} />
		</Box>
	);
}
