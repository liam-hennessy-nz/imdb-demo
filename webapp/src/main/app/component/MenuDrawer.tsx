import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataArrayIcon from '@mui/icons-material/DataArray';
import HomeIcon from '@mui/icons-material/Home';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import PersonIcon from '@mui/icons-material/Person';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router';
import { useAppContext } from '../context/AppContext.ts';

export function MenuDrawer() {
	const { isMenuDrawerOpen, setMenuDrawerOpen } = useAppContext();

	function handleDrawerClose() {
		setMenuDrawerOpen(false);
	}

	return (
		<Drawer open={isMenuDrawerOpen} onClose={handleDrawerClose}>
			<List sx={{ width: 300 }}>
				<ListItem>
					<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
						<ListItemIcon>
							<PersonIcon />
						</ListItemIcon>
						<ListItemText primary="Names" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
						<ListItemIcon>
							<LocalMoviesIcon />
						</ListItemIcon>
						<ListItemText primary="Titles" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
						<ListItemIcon>
							<QuestionMarkIcon />
						</ListItemIcon>
						<ListItemText primary="Other" />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} to="/datasets" onClick={handleDrawerClose}>
						<ListItemIcon>
							<DataArrayIcon />
						</ListItemIcon>
						<ListItemText primary="Datasets" />
					</ListItemButton>
				</ListItem>
				<Divider />
				<ListItem>
					<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
						<ListItemIcon>
							<AccountCircleIcon />
						</ListItemIcon>
						<ListItemText primary="Profile" />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
}
