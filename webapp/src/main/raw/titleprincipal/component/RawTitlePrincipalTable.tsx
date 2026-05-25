import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawTitlePrincipalPage } from '../service/rawTitlePrincipalService.ts';

export function RawTitlePrincipalTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawTitlePrincipal" onPage={getRawTitlePrincipalPage} />
		</Box>
	);
}
