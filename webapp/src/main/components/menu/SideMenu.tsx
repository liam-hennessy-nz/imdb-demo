import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router';
import type { MenuItem } from 'primereact/menuitem';

function SideMenu() {
	const navigate = useNavigate();
	const location = useLocation();

	const items: MenuItem[] = [
		{
			label: 'Home',
			command: () => {
				void navigate({
					pathname: '/',
					search: location.search,
				});
			},
		},
		{
			label: 'Titles',
			command: () => {
				void navigate({
					pathname: '/titles',
					search: location.search,
				});
			},
		},
		{
			label: 'Documents',
			command: () => {
				void navigate({
					pathname: '/documents',
					search: location.search,
				});
			},
		},
		{
			label: 'Other',
			command: () => {
				void navigate({
					pathname: '/other',
					search: location.search,
				});
			},
		},
		{
			label: 'Profile',
			items: [
				{
					label: 'Settings',
					icon: 'pi pi-cog',
				},
				{
					label: 'Logout',
					icon: 'pi pi-sign-out',
				},
			],
		},
	];

	return (
		<Menu
			model={items}
			style={{
				width: '100%',
				borderRadius: 0,
			}}
		/>
	);
}

export default SideMenu;
