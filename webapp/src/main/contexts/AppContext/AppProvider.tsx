import { type PropsWithChildren } from 'react';
import type { AppContextType } from './types';
import { AppContext } from './AppContext';
import { useLocalStorage } from 'primereact/hooks';

export function AppProvider({ children }: PropsWithChildren) {
	const [isSidebarVisible, setIsSidebarVisible] = useLocalStorage(false, 'isSidebarVisible');

	const handleToggleSidebarVisible = () => {
		setIsSidebarVisible((prev) => !prev);
	};

	const value: AppContextType = {
		isSidebarVisible,
		handleToggleSidebarVisible,
	};

	return <AppContext value={value}>{children}</AppContext>;
}
