import Box from '@mui/material/Box';
import { AliasTable } from './AliasTable.tsx';

export function AliasPage() {
	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<AliasTable />
		</Box>
	);
}
