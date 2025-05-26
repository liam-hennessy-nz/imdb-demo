import type { PropsWithChildren } from 'react';
import useWebSocket from '../../../hooks/useWebSocket.ts';
import { API } from '../../../constants/api.ts';
import type { SessionSocketContextType } from './types.ts';
import { SessionSocketContext } from './SessionSocketContext.ts';

export function SessionSocketProvider({ children }: PropsWithChildren) {
	const sessionSocket = useWebSocket(API.WEBSOCKET_SESSION_URL);

	const value: SessionSocketContextType = {
		isConnected: sessionSocket.isConnected,
		send: sessionSocket.send,
	};

	return <SessionSocketContext value={value}>{children}</SessionSocketContext>;
}
