import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawTitleBasicPage } from '../service/rawTitleBasicService.ts';

export function RawTitleBasicTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawTitleBasic" onPage={getRawTitleBasicPage} />
		</Box>
	);
}
