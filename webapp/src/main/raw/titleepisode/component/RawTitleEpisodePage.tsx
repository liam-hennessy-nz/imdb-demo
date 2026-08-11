import Box from '@mui/material/Box';
import { RawTitleEpisodeTable } from './RawTitleEpisodeTable.tsx';

export function RawTitleEpisodePage() {
	return (
		<Box sx={{ flex: 1, display: 'flex' }}>
			<RawTitleEpisodeTable />
		</Box>
	);
}
