import { AngleDoubleLeftIcon, AngleDoubleRightIcon } from '@primereact/icons';
import { Button } from '@primereact/ui/button';
import { Menu } from '@primereact/ui/menu';
import { Link } from 'react-router';
import { useApp } from '../../context/AppContext/AppContext.ts';

export function SideMenu() {
	const { isSideMenuExpanded, toggleSideMenuExpanded } = useApp();

	return (
		<div className="flex flex-1 overflow-hidden whitespace-nowrap">
			<div className="flex flex-1 flex-col border-r border-surface-600 overflow-hidden whitespace-nowrap">
				<div className="ml-auto mr-2 my-2">
					<Button className="w-8 h-8" onClick={toggleSideMenuExpanded}>
						{isSideMenuExpanded ? <AngleDoubleLeftIcon /> : <AngleDoubleRightIcon />}
					</Button>
				</div>
				<Menu.Root>
					<Link to="/">
						<Menu.Item>Home</Menu.Item>
					</Link>
					<Link to="/names">
						<Menu.Item>Names</Menu.Item>
					</Link>
					<Link to="/titles">
						<Menu.Item>Titles</Menu.Item>
					</Link>
					<Link to="/documents">
						<Menu.Item>Documents</Menu.Item>
					</Link>
					<Link to="/other">
						<Menu.Item>Other</Menu.Item>
					</Link>
					<Link to="/datasets">
						<Menu.Item>Manage Datasets</Menu.Item>
					</Link>
					<Menu.Separator />
					<Menu.Label>Profile</Menu.Label>
					<Menu.Item>Test</Menu.Item>
				</Menu.Root>
			</div>
		</div>
	);
}
