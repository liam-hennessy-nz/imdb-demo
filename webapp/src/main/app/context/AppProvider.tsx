import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { STORAGE } from '../../shared/constant/constants.ts';
import { useStorageContext } from '../../storage/context/StorageContext.ts';
import { AppContext } from './AppContext.ts';

export interface AppContextState {
	isDarkModeEnabled: boolean;
	isMenuDrawerOpen: boolean;
	isUploadDrawerOpen: boolean;
	setDarkModeEnabled: (isEnabled: boolean) => void;
	setMenuDrawerOpen: (isVisible: boolean) => void;
	setUploadDrawerOpen: (isVisible: boolean) => void;
	toggleDarkModeEnabled: () => void;
	toggleMenuDrawerOpen: () => void;
	toggleUploadDrawerOpen: () => void;
}

export function AppProvider({ children }: PropsWithChildren) {
	const storage = useStorageContext();

	const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(() => {
		const defaultVal = matchMedia('(prefers-color-scheme: dark)').matches;
		const initVal = (storage.find(STORAGE.KEYS.IS_DARK_MODE_ENABLED) as boolean | string | null) ?? defaultVal;
		return initVal === true || initVal === 'true';
	});

	const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);

	const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState<boolean>(false);

	const handleToggleIsDarkModeEnabled = useCallback(() => {
		setIsDarkModeEnabled(!isDarkModeEnabled);
	}, [isDarkModeEnabled]);

	const handleToggleIsMenuDrawerOpen = useCallback(() => {
		setIsMenuDrawerOpen(!isMenuDrawerOpen);
	}, [isMenuDrawerOpen]);

	const handleToggleIsUploadsDrawerOpen = useCallback(() => {
		setIsUploadDrawerOpen(!isUploadDrawerOpen);
	}, [isUploadDrawerOpen]);

	useEffect(() => {
		storage.set(STORAGE.KEYS.IS_DARK_MODE_ENABLED, JSON.stringify(isDarkModeEnabled), {
			doUpdateSearchParam: true,
			doPreferSearchParam: true,
		});
	}, [isDarkModeEnabled, storage]);

	const value: AppContextState = useMemo(() => {
		return {
			isDarkModeEnabled,
			isMenuDrawerOpen,
			isUploadDrawerOpen,
			setDarkModeEnabled: setIsDarkModeEnabled,
			setMenuDrawerOpen: setIsMenuDrawerOpen,
			setUploadDrawerOpen: setIsUploadDrawerOpen,
			toggleDarkModeEnabled: handleToggleIsDarkModeEnabled,
			toggleMenuDrawerOpen: handleToggleIsMenuDrawerOpen,
			toggleUploadDrawerOpen: handleToggleIsUploadsDrawerOpen,
		};
	}, [
		isDarkModeEnabled,
		isMenuDrawerOpen,
		isUploadDrawerOpen,
		handleToggleIsDarkModeEnabled,
		handleToggleIsMenuDrawerOpen,
		handleToggleIsUploadsDrawerOpen,
	]);

	return <AppContext value={value}>{children}</AppContext>;
}
