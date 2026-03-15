import { Outlet } from 'react-router';
import { Banner } from './main/shared/component/menu/Banner.tsx';
import { SideMenu } from './main/shared/component/menu/SideMenu.tsx';
import { useApp } from './main/shared/context/AppContext/AppContext.ts';
import { AppRoutes } from './main/shared/route/AppRoutes.tsx';

export function App() {
	const { isSideMenuExpanded } = useApp();

	return (
		<AppRoutes>
			<div className="flex flex-col w-screen h-screen">
				<div className="flex h-15">
					<Banner />
				</div>
				<div className="flex flex-1">
					<div className={`flex ${isSideMenuExpanded ? 'w-60' : 'w-12'} transition-[width] duration-500 ease-in-out`}>
						<SideMenu />
					</div>
					<div className="flex flex-1 p-4">
						<Outlet />
					</div>
				</div>
			</div>
		</AppRoutes>
	);
}
