import './panels.css';

import LeftPanel from './LeftPanel';
import SideMenu from '../menu/SideMenu';
import PanelToggleButton from './PanelToggleButton';
import RightPanel from './RightPanel';
import { Outlet } from 'react-router';
import TopPanel from './TopPanel';
import BannerMenu from '../menu/BannerMenu';

function PanelContainer() {
	return (
		<div className="panel-container flex flex-column w-screen h-screen">
			<div className="flex flex-shrink-0 h-3rem">
				<TopPanel>
					<BannerMenu />
				</TopPanel>
			</div>

			<div className="flex h-full">
				<LeftPanel>
					<SideMenu />
					<PanelToggleButton />
				</LeftPanel>

				<RightPanel>
					<div className="flex w-full p-2">
						<Outlet />
					</div>
				</RightPanel>
			</div>
		</div>
	);
}

export default PanelContainer;
