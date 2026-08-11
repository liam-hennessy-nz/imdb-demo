import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import type { SyntheticEvent } from 'react';

interface CustomColumnMenuFilterItemProps {
	onClick: () => void;
	hideMenu: (ev: SyntheticEvent) => void;
}

export function CustomColumnMenuFilterItem(props: CustomColumnMenuFilterItemProps) {
	const { onClick, hideMenu } = props;

	function handleClick(ev: SyntheticEvent) {
		hideMenu(ev);
		onClick();
	}

	return (
		<MenuItem onClick={handleClick}>
			<ListItemIcon>
				<FilterAltIcon fontSize="small" />
			</ListItemIcon>
			<ListItemText>Filter</ListItemText>
		</MenuItem>
	);
}
