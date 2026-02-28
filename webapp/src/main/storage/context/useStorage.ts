import { use } from 'react';
import { StorageContext } from './StorageContext.ts';

export function useStorage() {
	const context = use(StorageContext);

	if (context === undefined) throw new Error('useStorage must be used within StorageProvider');

	return context;
}
