import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useStorage } from '../../../storage/context/StorageContext.ts';
import { STORAGE } from '../../constant/constants.ts';
import { AppContext } from './AppContext.ts';

export interface AppContextType {
	isDarkModeEnabled: boolean;
	isSidebarVisible: boolean;
	isUploadsVisible: boolean;
	setDarkModeEnabled: (isEnabled: boolean) => void;
	setSidebarVisible: (isVisible: boolean) => void;
	setUploadsVisible: (isVisible: boolean) => void;
	toggleDarkModeEnabled: () => void;
	toggleSidebarVisible: () => void;
	toggleUploadsVisible: () => void;
}

export function AppProvider({ children }: PropsWithChildren) {
	const storage = useStorage();

	const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(() => {
		const initVal = (storage.find(STORAGE.KEYS.IS_DARK_MODE_ENABLED) as boolean | string | null) ?? false;
		return initVal === true || initVal === 'true';
	});
	const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => {
		const initVal = (storage.find(STORAGE.KEYS.IS_SIDEBAR_VISIBLE) as boolean | string | null) ?? true;
		return initVal === true || initVal === 'true';
	});
	const [isUploadsVisible, setIsUploadsVisible] = useState<boolean>(() => {
		const initVal = (storage.find(STORAGE.KEYS.IS_UPLOADS_VISIBLE) as boolean | string | null) ?? false;
		return initVal === true || initVal === 'true';
	});

	const toggleDarkModeEnabled = useCallback(() => {
		setIsDarkModeEnabled(!isDarkModeEnabled);
	}, [isDarkModeEnabled]);

	const toggleSidebarVisible = useCallback(() => {
		setIsSidebarVisible(!isSidebarVisible);
	}, [isSidebarVisible]);

	const toggleUploadsVisible = useCallback(() => {
		setIsUploadsVisible(!isUploadsVisible);
	}, [isUploadsVisible]);

	useEffect(() => {
		if (isDarkModeEnabled) {
			document.documentElement.classList.add('dark-mode');
		} else {
			document.documentElement.classList.remove('dark-mode');
		}

		const setOptions = { doUpdateSearchParams: true, doPreferSearchParam: true };
		storage.set(STORAGE.KEYS.IS_DARK_MODE_ENABLED, JSON.stringify(isDarkModeEnabled), setOptions);
	}, [isDarkModeEnabled, storage]);

	useEffect(() => {
		const setOptions = { doUpdateSearchParams: true, doPreferSearchParam: true };
		storage.set(STORAGE.KEYS.IS_SIDEBAR_VISIBLE, JSON.stringify(isSidebarVisible), setOptions);
	}, [isSidebarVisible, storage]);

	useEffect(() => {
		const setOptions = { doUpdateSearchParams: true, doPreferSearchParam: true };
		storage.set(STORAGE.KEYS.IS_UPLOADS_VISIBLE, JSON.stringify(isUploadsVisible), setOptions);
	}, [isUploadsVisible, storage]);

	const value: AppContextType = useMemo(() => {
		return {
			isDarkModeEnabled,
			isSidebarVisible,
			isUploadsVisible,
			setDarkModeEnabled: setIsDarkModeEnabled,
			setSidebarVisible: setIsSidebarVisible,
			setUploadsVisible: setIsUploadsVisible,
			toggleDarkModeEnabled,
			toggleSidebarVisible,
			toggleUploadsVisible,
		};
	}, [
		isDarkModeEnabled,
		isSidebarVisible,
		isUploadsVisible,
		toggleDarkModeEnabled,
		toggleSidebarVisible,
		toggleUploadsVisible,
	]);

	return <AppContext value={value}>{children}</AppContext>;
}
