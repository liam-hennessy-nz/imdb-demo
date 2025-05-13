import { use } from 'react';
import { LocalStorageContext } from './LocalStorageContext';

export function useLocalStorage() {
	const context = use(LocalStorageContext);

	if (!context) {
		throw new Error('useLocalStorage must be used within LocalStorageProvider');
	}

	return context;
}
