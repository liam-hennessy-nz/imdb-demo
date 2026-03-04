import { createContext, use } from 'react';
import type { AppContextType } from './AppProvider.tsx';

/**
 * Create context for {@link AppProvider}.
 */
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Hook for accessing {@link AppContext}.
 */
export function useApp() {
	const context = use(AppContext);

	if (context === undefined) throw new Error('useApp must be used within AppProvider');

	return context;
}
