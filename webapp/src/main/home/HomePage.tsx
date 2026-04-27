import Box from '@mui/material/Box';
import { HomeTable } from './HomeTable.tsx';

export function HomePage() {
	return (
		<Box sx={{ display: 'flex', flex: 1 }}>
			<HomeTable />
		</Box>
	);
}
