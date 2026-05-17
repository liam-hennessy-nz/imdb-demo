import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawTitleAkaPage } from '../service/rawTitleAkaService.ts';

export function RawTitleAkaTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawTitleAka" onPage={getRawTitleAkaPage} />
		</Box>
	);
}
