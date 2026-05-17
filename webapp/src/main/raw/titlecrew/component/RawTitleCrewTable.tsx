import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawTitleCrewPage } from '../service/rawTitleCrewService.ts';

export function RawTitleCrewTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawTitleCrew" onPage={getRawTitleCrewPage} />
		</Box>
	);
}
