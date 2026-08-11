import Box from '@mui/material/Box';
import { Outlet } from 'react-router';
import { MenuBar } from './main/app/component/MenuBar.tsx';
import { MenuDrawer } from './main/app/component/MenuDrawer.tsx';
import { UploadDrawer } from './main/upload/component/UploadDrawer.tsx';

export function App() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<MenuBar />

			<Box component="main" sx={{ display: 'flex', flex: 1, p: 2, minWidth: 0, minHeight: 0 }}>
				<Outlet />
			</Box>

			<MenuDrawer />
			<UploadDrawer />
		</Box>
	);
}
