import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataArrayIcon from '@mui/icons-material/DataArray';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import PersonIcon from '@mui/icons-material/Person';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RawOnIcon from '@mui/icons-material/RawOn';
import Collapse from '@mui/material/Collapse';
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

				<ListItemButton component={Link} to="/alias" onClick={handleDrawerClose}>
					<ListItemIcon>
						<LocalMoviesIcon />
					</ListItemIcon>
					<ListItemText primary="Aliases" />
				</ListItemButton>

				<ListItemButton component={Link} to="/character" onClick={handleDrawerClose}>
					<ListItemIcon>
						<LocalMoviesIcon />
					</ListItemIcon>
					<ListItemText primary="Characters" />
				</ListItemButton>

				<ListItemButton component={Link} to="/genre" onClick={handleDrawerClose}>
					<ListItemIcon>
						<LocalMoviesIcon />
					</ListItemIcon>
					<ListItemText primary="Genres" />
				</ListItemButton>

				<ListItemButton component={Link} to="/person" onClick={handleDrawerClose}>
					<ListItemIcon>
						<PersonIcon />
					</ListItemIcon>
					<ListItemText primary="People" />
				</ListItemButton>

				<ListItemButton component={Link} to="/profession" onClick={handleDrawerClose}>
					<ListItemIcon>
						<LocalMoviesIcon />
					</ListItemIcon>
					<ListItemText primary="Professions" />
				</ListItemButton>

				<ListItemButton component={Link} to="/title" onClick={handleDrawerClose}>
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

				<Divider />

				<ListItemButton onClick={handleToggleRawNestOpen}>
					<ListItemIcon>
						<RawOnIcon />
					</ListItemIcon>
					<ListItemText primary="Raw Dataset" />
					{isRawNestOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItemButton>

				<Collapse in={isRawNestOpen} timeout="auto" unmountOnExit>
					<List component="div" disablePadding sx={{ pl: 2 }}>
						<ListItemButton component={Link} to="/dataset" onClick={handleDrawerClose}>
							<ListItemIcon>
								<DataArrayIcon />
							</ListItemIcon>
							<ListItemText primary="Manage" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/name_basic" onClick={handleDrawerClose}>
							<ListItemIcon>
								<PersonIcon />
							</ListItemIcon>
							<ListItemText primary="Name Basic" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_aka" onClick={handleDrawerClose}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Aka" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_basic" onClick={handleDrawerClose}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Basic" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_episode" onClick={handleDrawerClose}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Episode" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_principal" onClick={handleDrawerClose}>
							<ListItemIcon>
								<LocalMoviesIcon />
							</ListItemIcon>
							<ListItemText primary="Title Principal" />
						</ListItemButton>

						<ListItemButton component={Link} to="/raw/title_rating" onClick={handleDrawerClose}>
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
