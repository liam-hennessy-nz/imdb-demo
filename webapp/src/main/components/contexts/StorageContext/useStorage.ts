import { StorageContext } from './StorageContext.ts';
import { use } from 'react';

export function useStorage() {
	const context = use(StorageContext);

	if (!context) throw new Error('useStorage must be used within StorageProvider');

	return context;
}
