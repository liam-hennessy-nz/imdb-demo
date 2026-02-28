import { Button } from '@primereact/ui/button';
import { useState } from 'react';
import { UploadFileDialog } from '../../../../upload/component/dialog/UploadFileDialog.tsx';
import { devLog } from '../../../util/devLog.ts';

function TitlesPage() {
	const [isImportDialogVisible, setIsImportDialogVisible] = useState<boolean>(false);

	function handleImportTitlesHide(error?: Error) {
		if (error !== undefined) {
			devLog.error(error);
		}
		setIsImportDialogVisible(false);
	}

	return (
		<div>
			<Button
				onClick={() => {
					setIsImportDialogVisible(true);
				}}
			>
				Import Titles...
			</Button>
			<UploadFileDialog visible={isImportDialogVisible} onHide={handleImportTitlesHide} />
		</div>
	);
}

export default TitlesPage;
