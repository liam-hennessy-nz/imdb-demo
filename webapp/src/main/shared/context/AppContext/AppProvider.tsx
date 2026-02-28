import { useEffect, useState, type PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router';
import { useStorage } from '../../../storage/context/useStorage.ts';
import { STORAGE } from '../../constant/constants.ts';
import { devLog } from '../../util/devLog.ts';
import { AppContext, type AppContextType } from './AppContext.ts';

export function AppProvider({ children }: PropsWithChildren) {
	const storage = useStorage();
	const [searchParams, setSearchParams] = useSearchParams();

	const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(false);
	const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
	const [isUploadsVisible, setIsUploadsVisible] = useState<boolean>(false);

	function handleSetDarkModeEnabled(isEnabled: boolean) {
		storage.set(STORAGE.KEYS.IS_DARK_MODE_ENABLED, JSON.stringify(isEnabled));
		setIsDarkModeEnabled(isEnabled);
	}

	function handleSetSidebarVisible(isVisible: boolean) {
		storage.set(STORAGE.KEYS.IS_SIDEBAR_VISIBLE, JSON.stringify(isVisible));
		setIsSidebarVisible(isVisible);
	}

	function handleSetUploadsVisible(isVisible: boolean) {
		storage.set(STORAGE.KEYS.IS_UPLOADS_VISIBLE, JSON.stringify(isVisible));
		setIsUploadsVisible(isVisible);
	}

	function toggleDarkModeEnabled() {
		setIsDarkModeEnabled(!isDarkModeEnabled);
	}

	function toggleSidebarVisible() {
		setIsSidebarVisible(!isSidebarVisible);
	}

	function toggleUploadsVisible() {
		setIsUploadsVisible(!isUploadsVisible);
	}

	useEffect(() => {
		if (isDarkModeEnabled) {
			document.documentElement.classList.add('dark-mode');
		} else {
			document.documentElement.classList.remove('dark-mode');
		}
	}, [isDarkModeEnabled]);

	useEffect(() => {
		// TODO: Needs a cleanup
		const darkMode = storage.parse(STORAGE.KEYS.IS_DARK_MODE_ENABLED, { doClearSearchParam: true }) as boolean;
		devLog.debug(`Retrieved param 'isDarkModeEnabled': ${darkMode}`);
		const sideBar = storage.parse(STORAGE.KEYS.IS_SIDEBAR_VISIBLE, { doClearSearchParam: true }) as boolean;
		devLog.debug(`Retrieved param 'isSidebarVisible': ${sideBar}`);
		setIsDarkModeEnabled(darkMode);
		setIsSidebarVisible(sideBar);
	}, [searchParams, setSearchParams, storage]);

	const value: AppContextType = {
		isDarkModeEnabled,
		isSidebarVisible,
		isUploadsVisible,
		setDarkModeEnabled: handleSetDarkModeEnabled,
		setSidebarVisible: handleSetSidebarVisible,
		setUploadsVisible: handleSetUploadsVisible,
		toggleDarkModeEnabled,
		toggleSidebarVisible,
		toggleUploadsVisible,
	};

	return <AppContext value={value}>{children}</AppContext>;
}
