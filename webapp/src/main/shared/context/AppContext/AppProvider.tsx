import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useStorage } from '../../../storage/context/StorageContext.ts';
import { STORAGE } from '../../constant/constants.ts';
import { AppContext } from './AppContext.ts';

export interface AppContextType {
	isDarkModeEnabled: boolean;
	isSideMenuExpanded: boolean;
	isUploadsVisible: boolean;
	setDarkModeEnabled: (isEnabled: boolean) => void;
	setSideMenuExpanded: (isVisible: boolean) => void;
	setUploadsVisible: (isVisible: boolean) => void;
	toggleDarkModeEnabled: () => void;
	toggleSideMenuExpanded: () => void;
	toggleUploadsVisible: () => void;
}

export function AppProvider({ children }: PropsWithChildren) {
	const storage = useStorage();

	const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(() => {
		const defaultVal = matchMedia('(prefers-color-scheme: dark)').matches;
		const initVal = (storage.find(STORAGE.KEYS.IS_DARK_MODE_ENABLED) as boolean | string | null) ?? defaultVal;
		return initVal === true || initVal === 'true';
	});
	const [isSideMenuExpanded, setIsSideMenuExpanded] = useState<boolean>(() => {
		const initVal = (storage.find(STORAGE.KEYS.IS_SIDEBAR_VISIBLE) as boolean | string | null) ?? true;
		return initVal === true || initVal === 'true';
	});
	const [isUploadsVisible, setIsUploadsVisible] = useState<boolean>(false);

	const handleToggleIsDarkModeEnabled = useCallback(() => {
		setIsDarkModeEnabled(!isDarkModeEnabled);
	}, [isDarkModeEnabled]);

	const handleToggleIsSideMenuExpanded = useCallback(() => {
		setIsSideMenuExpanded(!isSideMenuExpanded);
	}, [isSideMenuExpanded]);

	const handleToggleIsUploadsVisible = useCallback(() => {
		setIsUploadsVisible(!isUploadsVisible);
	}, [isUploadsVisible]);

	useEffect(() => {
		if (isDarkModeEnabled) {
			document.documentElement.classList.add('dark-mode');
		} else {
			document.documentElement.classList.remove('dark-mode');
		}

		storage.set(STORAGE.KEYS.IS_DARK_MODE_ENABLED, JSON.stringify(isDarkModeEnabled), {
			doUpdateSearchParam: true,
			doPreferSearchParam: true,
		});
	}, [isDarkModeEnabled, storage]);

	useEffect(() => {
		storage.set(STORAGE.KEYS.IS_SIDEBAR_VISIBLE, JSON.stringify(isSideMenuExpanded), {
			doUpdateSearchParam: true,
			doPreferSearchParam: true,
		});
	}, [isSideMenuExpanded, storage]);

	const value: AppContextType = useMemo(() => {
		return {
			isDarkModeEnabled,
			isSideMenuExpanded,
			isUploadsVisible,
			setDarkModeEnabled: setIsDarkModeEnabled,
			setSideMenuExpanded: setIsSideMenuExpanded,
			setUploadsVisible: setIsUploadsVisible,
			toggleDarkModeEnabled: handleToggleIsDarkModeEnabled,
			toggleSideMenuExpanded: handleToggleIsSideMenuExpanded,
			toggleUploadsVisible: handleToggleIsUploadsVisible,
		};
	}, [
		isDarkModeEnabled,
		isSideMenuExpanded,
		isUploadsVisible,
		handleToggleIsDarkModeEnabled,
		handleToggleIsSideMenuExpanded,
		handleToggleIsUploadsVisible,
	]);

	return <AppContext value={value}>{children}</AppContext>;
}
