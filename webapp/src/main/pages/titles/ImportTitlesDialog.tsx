import { Dialog } from 'primereact/dialog';
import {
	FileUpload,
	type FileUploadErrorEvent,
	type FileUploadHandlerEvent,
	type FileUploadUploadEvent,
} from 'primereact/fileupload';
import useWebSocket from '../../hooks/useWebSocket';
import { WEBSOCKET_UPLOAD_URL } from '../../constants/api';
import { useEffect } from 'react';

interface ImportTitlesDialogProps {
	visible: boolean;
	onHide: () => void;
}

function ImportTitlesDialog({ visible, onHide }: ImportTitlesDialogProps) {
	const uploadSocket = useWebSocket(WEBSOCKET_UPLOAD_URL);

	const uploadHandler = async (e: FileUploadHandlerEvent) => {
		// Attempt to start web socket connection
		try {
			const file = e.files[0];
			// If WebSocket not already connected
			if (!uploadSocket.isConnected) {
				// Establish a new WebSocket connection
				await uploadSocket.connect();
			}
			// Send the file
			await uploadSocket.streamFileInChunks(file);
		} catch (error) {
			console.debug(error);
		}
	};

	function onUpload(e: FileUploadUploadEvent) {
		console.debug('Success:', e.files);
	}

	function onError(e: FileUploadErrorEvent) {
		console.debug('Error:', e);
	}

	useEffect(() => {
		if (!visible) return;
	}, [visible]);

	return (
		<Dialog visible={visible} onHide={onHide} header="Import Titles">
			<FileUpload
				name="file"
				mode="basic"
				accept=".tsv"
				customUpload
				chooseLabel="Upload TSV"
				uploadHandler={(e) => void uploadHandler(e)}
				onUpload={onUpload}
				onError={onError}
			/>
		</Dialog>
	);
}

export default ImportTitlesDialog;
