import Box from '@mui/material/Box';
import { ProfessionTable } from './ProfessionTable.tsx';

export function ProfessionPage() {
	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<ProfessionTable />
		</Box>
	);
}
