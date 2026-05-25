import { Alert, type SnackbarCloseReason } from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren, type SyntheticEvent } from 'react';
import { NotifyContext } from './NotifyContext.ts';

interface SnackbarItem {
	id: number;
	message: string;
	severity: AlertColor;
	timeoutMs?: number;
}

export interface NotifyContextState {
	showSnackbar: (message: string, severity: AlertColor, timeoutMs?: number) => void;
}

export function NotifyProvider({ children }: PropsWithChildren) {
	const [queue, setQueue] = useState<SnackbarItem[]>([]);
	const [current, setCurrent] = useState<SnackbarItem | null>(null);

	useEffect(() => {
		function handleQueueUpdate() {
			if (current === null && queue.length > 0) {
				setCurrent(queue[0]);
				setQueue((prev) => prev.slice(1));
			}
		}
		handleQueueUpdate();
	}, [current, queue]);

	const handleShowSnackbar = useCallback((message: string, severity?: AlertColor, timeoutMs?: number) => {
		setQueue((prev) => [...prev, { id: Date.now(), message, severity: severity ?? 'info', timeoutMs }]);
	}, []);

	function handleClose(_ev: SyntheticEvent | Event, reason?: SnackbarCloseReason) {
		if (reason === 'clickaway') return;
		setCurrent(null);
	}

	const value: NotifyContextState = useMemo(() => {
		return { showSnackbar: handleShowSnackbar };
	}, [handleShowSnackbar]);

	return (
		<NotifyContext value={value}>
			{children}
			<Snackbar key={current?.id} open={current !== null} onClose={handleClose} autoHideDuration={current?.timeoutMs}>
				<Alert severity={current?.severity} onClose={handleClose}>
					{current?.message}
				</Alert>
			</Snackbar>
		</NotifyContext>
	);
}
