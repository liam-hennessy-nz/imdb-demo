import Box from '@mui/material/Box';
import { GenreTable } from './GenreTable.tsx';

export function GenrePage() {
	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<GenreTable />
		</Box>
	);
}
