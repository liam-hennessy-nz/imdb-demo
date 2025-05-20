import { type PropsWithChildren, useState } from 'react';
import type { AppContextType } from './types';
import { AppContext } from './AppContext';
import { useStorage } from '../StorageContext';
import { IS_SIDEBAR_VISIBLE } from '../../constants/storage.ts';

export function AppProvider({ children }: PropsWithChildren) {
	const storage = useStorage();

	const initIsSidebarVisible = storage.parseLocalStorage(IS_SIDEBAR_VISIBLE) as boolean;

	const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(initIsSidebarVisible);

	const handleToggleSidebarVisible = () => {
		setIsSidebarVisible((prev) => {
			storage.set(IS_SIDEBAR_VISIBLE, JSON.stringify(!prev), true);
			return !prev;
		});
	};

	const value: AppContextType = {
		isSidebarVisible,
		handleToggleSidebarVisible,
	};

	return <AppContext value={value}>{children}</AppContext>;
}
