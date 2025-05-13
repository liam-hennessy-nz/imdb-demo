import { use } from 'react';
import { AppContext } from './AppContext';

export function useApp() {
	const context = use(AppContext);

	if (!context) {
		throw new Error('useUser must be used within AppProvider');
	}

	return context;
}
