import { createContext, use } from 'react';
import type { UploadContextType } from './UploadProvider.tsx';

/**
 * Create context for {@link UploadProvider}.
 */
export const UploadContext = createContext<UploadContextType | undefined>(undefined);

/**
 * Hook for accessing {@link UploadContext}.
 */
export function useUpload() {
	const context = use(UploadContext);

	if (context === undefined) throw new Error('useUpload must be used within UploadProvider');

	return context;
}
