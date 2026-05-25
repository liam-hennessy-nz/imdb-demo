import Box from '@mui/material/Box';
import { RawTitleEpisodeTable } from './RawTitleEpisodeTable.tsx';

export function RawTitleEpisodePage() {
	return (
		<Box sx={{ display: 'flex', flex: 1 }}>
			<RawTitleEpisodeTable />
		</Box>
	);
}
