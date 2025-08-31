import { Button } from 'primereact/button';
import { useSessionSocket } from '../../contexts/SessionSocketContext';
import ImportTitlesDialog from './ImportTitlesDialog.tsx';
import { useState } from 'react';

function TitlesPage() {
	const sessionSocket = useSessionSocket();
	const [isImportDialogVisible, setIsImportDialogVisible] = useState<boolean>(false);

	return (
		<div>
			<Button
				label="Import Titles..."
				onClick={() => {
					sessionSocket.setIsUploadProgressVisible(true);
					setIsImportDialogVisible(true);
				}}
			/>
			<ImportTitlesDialog
				visible={isImportDialogVisible}
				onHide={() => {
					setIsImportDialogVisible(false);
				}}
			/>
		</div>
	);
}

export default TitlesPage;
