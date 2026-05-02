import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAppContext } from '../context/AppContext.ts';

export function MenuBar() {
	const { isDarkModeEnabled, toggleMenuDrawerOpen, toggleUploadDrawerOpen, toggleDarkModeEnabled } = useAppContext();

	return (
		<AppBar position="static">
			<Toolbar sx={{ flex: 1, justifyContent: 'space-between' }}>
				<IconButton aria-label="Menu" onClick={toggleMenuDrawerOpen}>
					<MenuIcon />
				</IconButton>

				<Typography>IMDb Demo</Typography>

				<Box sx={{ display: 'flex' }}>
					<IconButton aria-label="Dark mode" onClick={toggleDarkModeEnabled}>
						{isDarkModeEnabled ? <LightModeIcon /> : <DarkModeIcon />}
					</IconButton>

					<IconButton>
						<AccountCircleIcon />
					</IconButton>

					<IconButton aria-label="Uploads" onClick={toggleUploadDrawerOpen}>
						<FileUploadIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
