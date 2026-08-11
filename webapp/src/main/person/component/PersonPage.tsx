import Box from '@mui/material/Box';
import { PersonTable } from './PersonTable.tsx';

export function PersonPage() {
	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<PersonTable />
		</Box>
	);
}
