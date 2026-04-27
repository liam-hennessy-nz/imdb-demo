import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router';
import { MenuBar } from './main/app/MenuBar.tsx';
import { MenuDrawer } from './main/app/MenuDrawer.tsx';
import { UploadDrawer } from './main/upload/UploadDrawer.tsx';

export function App() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
			<Stack sx={{ flex: 1 }}>
				<Box sx={{ display: 'flex' }}>
					<MenuBar />
				</Box>

				<Box component="main" sx={{ display: 'flex', flex: 1, alignItems: 'start', justifyContent: 'start', p: 2 }}>
					<Outlet />
				</Box>
			</Stack>

			<MenuDrawer />
			<UploadDrawer />
		</Box>
	);
}
