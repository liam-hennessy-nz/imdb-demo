import { type PropsWithChildren, useState } from 'react';
import { useStorage } from '../StorageContext';
import { STORAGE } from '../../../constants/constants.ts';
import type { AppContextType } from './types.ts';
import { AppContext } from './AppContext.ts';

export function AppProvider({ children }: PropsWithChildren) {
	const storage = useStorage();

	const initIsSidebarVisible = storage.parseLocalStorage(STORAGE.IS_SIDEBAR_VISIBLE) as boolean;

	const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(initIsSidebarVisible);

	function handleToggleSidebarVisible() {
		setIsSidebarVisible((prev) => {
			storage.set(STORAGE.IS_SIDEBAR_VISIBLE, JSON.stringify(!prev), true);
			return !prev;
		});
	}

	const value: AppContextType = {
		isSidebarVisible,
		handleToggleSidebarVisible,
	};

	return <AppContext value={value}>{children}</AppContext>;
}
