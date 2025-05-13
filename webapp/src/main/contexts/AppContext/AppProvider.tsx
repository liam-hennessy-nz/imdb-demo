import { type PropsWithChildren, useCallback, useMemo } from 'react';
import type { AppContextType } from './types';
import { AppContext } from './AppContext';
import { useLocalStorage } from 'primereact/hooks';

export function AppProvider({ children }: PropsWithChildren) {
	const [isSidebarVisible, setIsSidebarVisible] = useLocalStorage(false, 'isSidebarVisible');

	const handleToggleSidebarVisible = useCallback(() => {
		setIsSidebarVisible((prev) => !prev);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const value: AppContextType = useMemo(
		() => ({
			isSidebarVisible,
			handleToggleSidebarVisible,
		}),
		[isSidebarVisible, handleToggleSidebarVisible]
	);

	return <AppContext value={value}>{children}</AppContext>;
}
