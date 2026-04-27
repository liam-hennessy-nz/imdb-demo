import { createContext, use } from 'react';
import type { UploadContextState } from './UploadProvider.tsx';

/**
 * Create context for {@link UploadProvider}.
 */
export const UploadContext = createContext<UploadContextState | undefined>(undefined);

/**
 * Hook for accessing {@link UploadContext}.
 */
export function useUploadContext() {
	const context = use(UploadContext);
	if (context === undefined) throw new Error('useUpload must be used within UploadProvider');

	return context;
}
