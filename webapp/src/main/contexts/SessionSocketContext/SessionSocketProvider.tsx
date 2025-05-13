import { type PropsWithChildren, useMemo } from 'react';
import type { SessionSocketContextType } from './types';
import { SessionSocketContext } from './SessionSocketContext';
import { WEBSOCKET_SESSION_URL } from '../../constants/api';
import useWebSocket from '../../hooks/useWebSocket';

export function SessionSocketProvider({ children }: PropsWithChildren) {
	const sessionSocket = useWebSocket(WEBSOCKET_SESSION_URL);

	const value: SessionSocketContextType = useMemo(
		() => ({
			isConnected: sessionSocket.isConnected,
			send: sessionSocket.send,
		}),
		[sessionSocket]
	);

	return <SessionSocketContext value={value}>{children}</SessionSocketContext>;
}
