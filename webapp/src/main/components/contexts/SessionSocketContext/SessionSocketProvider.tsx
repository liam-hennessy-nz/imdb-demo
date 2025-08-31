import { type PropsWithChildren, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket.ts';
import { API } from '../../../constants/api.ts';
import type { SessionSocketContextType } from './types.ts';
import { SessionSocketContext } from './SessionSocketContext.ts';
import UploadProgressToast from '../../toasts/UploadProgressToast.tsx';

export function SessionSocketProvider({ children }: PropsWithChildren) {
	const [isUploadProgressVisible, setIsUploadProgressVisible] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const ws = useWebSocket({
		url: API.WEBSOCKET_SESSION_URL,
		onProgress: setUploadProgress,
	});

	const value: SessionSocketContextType = {
		ws,
		setIsUploadProgressVisible,
		setUploadProgress,
	};

	return (
		<SessionSocketContext value={value}>
			{children}
			<UploadProgressToast visible={isUploadProgressVisible} progress={uploadProgress} />
		</SessionSocketContext>
	);
}
