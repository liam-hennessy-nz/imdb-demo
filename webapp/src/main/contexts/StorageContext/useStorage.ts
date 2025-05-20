import { StorageContext } from './StorageContext.tsx';
import { use } from 'react';

export function useStorage() {
	const context = use(StorageContext);

	if (!context) {
		throw new Error('useStorage must be used with StorageProvider');
	}

	return context;
}
