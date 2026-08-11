import Box from '@mui/material/Box';
import { CustomTable } from '../../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../../shared/dto/PageRequest.ts';
import { getRawTitleEpisodePage } from '../service/rawTitleEpisodeService.ts';

export function RawTitleEpisodeTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getRawTitleEpisodePage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="rawTitleEpisode" onPage={handlePage} getRowId={(row) => row.tconst} />
		</Box>
	);
}
