import Box from '@mui/material/Box';
import { CustomTable } from '../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import { getGenrePage } from '../service/GenreService.ts';

export function GenreTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getGenrePage(request, abortSignal);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="genre" onPage={handlePage} />
		</Box>
	);
}
