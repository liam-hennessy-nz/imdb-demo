import {
	FileUpload,
	type FileUploadErrorEvent,
	type FileUploadHandlerEvent,
	type FileUploadUploadEvent,
} from 'primereact/fileupload';
import { parseErrorMessage } from '../../../common/CommonFunctions.ts';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { useSessionSocket } from '../../contexts/SessionSocketContext';

interface ImportTitlesDialogProps {
	visible: boolean;
	onHide: () => void;
}

function ImportTitlesDialog({ visible, onHide }: ImportTitlesDialogProps) {
	const sessionSocket = useSessionSocket();

	const uploadHandler = async (e: FileUploadHandlerEvent) => {
		// Attempt to start web socket connection
		try {
			const file = e.files[0];
			// Send the file
			try {
				await sessionSocket.ws.sendFile(file);
			} catch (e) {
				console.error(`Failed to send file: ${parseErrorMessage(e)}`);
				sessionSocket.ws.disconnect();
			}
		} catch (e) {
			console.error(parseErrorMessage(e));
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
