import { createContext, use } from 'react';
import type { AppContextState } from './AppProvider.tsx';

/**
 * Create context for {@link AppProvider}.
 */
export const AppContext = createContext<AppContextState | undefined>(undefined);

/**
 * Hook for accessing {@link AppContext}.
 */
export function useAppContext() {
	const context = use(AppContext);

	if (context === undefined) throw new Error('useApp must be used within AppProvider');

	return context;
}
