import { use } from 'react';
import { SessionSocketContext } from './SessionSocketContext.ts';

export function useSessionSocket() {
	const context = use(SessionSocketContext);

	if (!context) throw new Error('useSessionSocket must be used within SessionSocketProvider');

	return context;
}
