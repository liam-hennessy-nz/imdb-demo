import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface ErrorDialogProps {
	error: Error;
}

export function ErrorDialog({ error }: ErrorDialogProps) {
	const [isOpen, setIsOpen] = useState<boolean>(true);

	function handleClose() {
		setIsOpen(false);
	}

	return (
		<Dialog open={isOpen} onClose={handleClose} maxWidth={false}>
			<DialogTitle>
				<Typography>Something went wrong! (ಠ_ಠ)</Typography>
				<IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<Box sx={{ borderRadius: '0.25rem', backgroundColor: 'black', overflow: 'auto' }}>
					<Typography
						sx={{
							p: '1rem',
							whiteSpace: 'pre',
							fontFamily: 'monospace',
							color: 'error.main',
							overflow: 'auto',
						}}
					>
						{error.stack ?? 'ಥ╭╮ಥ'}
					</Typography>
				</Box>
			</DialogContent>

			<DialogActions>
				<Typography>See console for more info</Typography>
			</DialogActions>
		</Dialog>
	);
}
