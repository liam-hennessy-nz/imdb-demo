import { Outlet } from 'react-router';
import Banner from './main/shared/component/menu/Banner.tsx';
import MainMenu from './main/shared/component/menu/MainMenu.tsx';
import { useApp } from './main/shared/context/AppContext/useApp.ts';
import AppRoutes from './main/shared/route/AppRoutes.tsx';

function App() {
	const { isSidebarVisible } = useApp();

	return (
		<AppRoutes>
			<div className="flex flex-col w-screen h-screen">
				<div className="flex h-15">
					<Banner />
				</div>
				<div className="flex flex-1">
					<div className={`flex ${isSidebarVisible ? 'w-60' : 'w-12'} transition-[width] duration-500 ease-in-out`}>
						<MainMenu />
					</div>
					<div className="flex flex-1 p-4">
						<Outlet />
					</div>
				</div>
			</div>
		</AppRoutes>
	);
}

export default App;
