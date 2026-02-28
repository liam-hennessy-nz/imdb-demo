import { use } from 'react';
import { UploadContext } from './UploadContext.ts';

export function useUpload() {
	const context = use(UploadContext);

	if (context === undefined) throw new Error('useUpload must be used within UploadProvider');

	return context;
}
