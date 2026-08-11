import Box from '@mui/material/Box';
import { CustomTable } from '../../shared/component/table/CustomTable.tsx';
import type { PageRequest } from '../../shared/dto/PageRequest.ts';
import { getTitlePage } from '../service/TitleService.ts';

export function TitleTable() {
	async function handlePage(request: PageRequest, abortSignal: AbortSignal) {
		return await getTitlePage(request, abortSignal);
	}

	return (
		<Box sx={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
			<CustomTable datasetKey="title" onPage={handlePage} />
		</Box>
	);
}
