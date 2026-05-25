import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawNameBasicPage } from '../service/rawNameBasicService.ts';

export function RawNameBasicTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawNameBasic" onPage={getRawNameBasicPage} />
		</Box>
	);
}
