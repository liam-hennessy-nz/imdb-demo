import { type PropsWithChildren } from 'react';
import type { SessionSocketContextType } from './types';
import { SessionSocketContext } from './SessionSocketContext';
import { WEBSOCKET_SESSION_URL } from '../../constants/api';
import useWebSocket from '../../hooks/useWebSocket';

export function SessionSocketProvider({ children }: PropsWithChildren) {
	const sessionSocket = useWebSocket(WEBSOCKET_SESSION_URL);

	const value: SessionSocketContextType = {
		isConnected: sessionSocket.isConnected,
		send: sessionSocket.send,
	};

	return <SessionSocketContext value={value}>{children}</SessionSocketContext>;
}
