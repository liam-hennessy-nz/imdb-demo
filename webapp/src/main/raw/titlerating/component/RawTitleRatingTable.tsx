import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawTitleRatingPage } from '../service/rawTitleRatingService.ts';

export function RawTitleRatingTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawTitleRating" onPage={getRawTitleRatingPage} />
		</Box>
	);
}
