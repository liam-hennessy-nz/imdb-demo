import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataArrayIcon from '@mui/icons-material/DataArray';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import PersonIcon from '@mui/icons-material/Person';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RawOnIcon from '@mui/icons-material/RawOn';
import { Collapse } from '@mui/material';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { Link } from 'react-router';
import { useAppContext } from '../context/AppContext.ts';

export function MenuDrawer() {
	const { isMenuDrawerOpen, setMenuDrawerOpen } = useAppContext();

	const [isRawNestOpen, setIsRawNestOpen] = useState<boolean>(false);

	function handleDrawerClose() {
		setMenuDrawerOpen(false);
	}

	function handleToggleRawNestOpen() {
		setIsRawNestOpen((prev) => !prev);
	}

	return (
		<Drawer open={isMenuDrawerOpen} onClose={handleDrawerClose}>
			<List sx={{ width: 300 }}>
				<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</ListItemButton>

				<ListItemButton component={Link} to="/raw/name_basic" onClick={handleDrawerClose}>
					<ListItemIcon>
						<PersonIcon />
					</ListItemIcon>
					<ListItemText primary="Names" />
				</ListItemButton>

				<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
					<ListItemIcon>
						<LocalMoviesIcon />
					</ListItemIcon>
					<ListItemText primary="Titles" />
				</ListItemButton>

				<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
					<ListItemIcon>
						<QuestionMarkIcon />
					</ListItemIcon>
					<ListItemText primary="Other" />
				</ListItemButton>

				<ListItemButton component={Link} to="/datasets" onClick={handleDrawerClose}>
					<ListItemIcon>
						<DataArrayIcon />
					</ListItemIcon>
					<ListItemText primary="Datasets" />
				</ListItemButton>

				<Divider />

				<ListItemButton onClick={handleToggleRawNestOpen}>
					<ListItemIcon>
						<RawOnIcon />
					</ListItemIcon>
					<ListItemText primary="Raw Datasets" />
					{isRawNestOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItemButton>

				<Collapse in={isRawNestOpen} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton component={Link} to="/raw/name_basic" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<PersonIcon />
							</ListItemIcon>
							<ListItemText primary="Name Basic" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_aka" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Aka" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_basic" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Basic" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_crew" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Crew" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_episode" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Episode" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_principal" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Principal" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_rating" onClick={handleDrawerClose} sx={{ pl: 4 }}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Rating" />
						</ListItemButton>
					</List>
				</Collapse>

				<ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
					<ListItemIcon>
						<AccountCircleIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItemButton>
			</List>
		</Drawer>
	);
}
