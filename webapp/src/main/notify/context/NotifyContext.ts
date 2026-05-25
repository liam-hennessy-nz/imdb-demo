import { createContext, use } from 'react';
import type { NotifyContextState } from './NotifyProvider.tsx';

/**
 * Create context for {@link NotifyProvider}.
 */
export const NotifyContext = createContext<NotifyContextState | undefined>(undefined);

/**
 * Hook for accessing {@link NotifyContext}.
 */
export function useNotifyContext() {
	const context = use(NotifyContext);

	if (context === undefined) throw new Error('useNotify must be used within NotifyProvider');

	return context;
}
