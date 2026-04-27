import { createContext, use } from 'react';
import type { StorageContextState } from './StorageProvider.tsx';

/**
 * Create context for {@link StorageProvider}.
 */
export const StorageContext = createContext<StorageContextState | undefined>(undefined);

/**
 * Hook for accessing {@link StorageContext}.
 */
export function useStorageContext() {
	const context = use(StorageContext);

	if (context === undefined) throw new Error('useStorage must be used within StorageProvider');

	return context;
}
