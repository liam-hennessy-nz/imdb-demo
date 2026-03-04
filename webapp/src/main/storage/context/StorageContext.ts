import { createContext, use } from 'react';
import type { StorageContextType } from './StorageProvider.tsx';

/**
 * Create context for {@link StorageProvider}.
 */
export const StorageContext = createContext<StorageContextType | undefined>(undefined);

/**
 * Hook for accessing {@link StorageContext}.
 */
export function useStorage() {
	const context = use(StorageContext);

	if (context === undefined) throw new Error('useStorage must be used within StorageProvider');

	return context;
}
