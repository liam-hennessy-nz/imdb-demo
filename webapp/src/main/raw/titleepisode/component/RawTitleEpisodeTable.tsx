import Box from '@mui/material/Box';
import { DatasetTable } from '../../../shared/component/table/DatasetTable.tsx';
import { getRawTitleEpisodePage } from '../service/rawTitleEpisodeService.ts';

export function RawTitleEpisodeTable() {
	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DatasetTable datasetKey="rawTitleEpisode" onPage={getRawTitleEpisodePage} />
		</Box>
	);
}
