import { use } from 'react';
import { AppContext } from './AppContext.ts';

export function useApp() {
	const context = use(AppContext);

	if (context === undefined) throw new Error('useApp must be used within AppProvider');

	return context;
}
