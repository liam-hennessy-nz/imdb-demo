import Box from '@mui/material/Box';
import { CharacterTable } from './CharacterTable.tsx';

export function CharacterPage() {
	return (
		<Box sx={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
			<CharacterTable />
		</Box>
	);
}
