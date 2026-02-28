import { createContext } from 'react';

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

export const AppContext = createContext<AppContextType | undefined>(undefined);
