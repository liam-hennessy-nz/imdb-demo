import Box from '@mui/material/Box';
import { TitleTable } from './TitleTable.tsx';

export function TitlePage() {
	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<TitleTable />
		</Box>
	);
}
