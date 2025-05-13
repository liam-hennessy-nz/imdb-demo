import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router';

function SideMenu() {
	const navigate = useNavigate();

	const items = [
		{
			label: 'Home',
			command: () => navigate('/'),
		},
		{
			label: 'Titles',
			command: () => navigate('/titles'),
		},
		{
			label: 'Documents',
			command: () => navigate('/documents'),
		},
		{
			label: 'Other',
			command: () => navigate('/other'),
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
