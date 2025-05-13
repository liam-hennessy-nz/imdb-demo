import { Button } from 'primereact/button';
import { useState } from 'react';
import ImportTitlesDialog from './ImportTitlesDialog';

function TitlesPage() {
	const [showImportDialog, setShowImportDialog] = useState<boolean>(false);

	return (
		<div>
			<Button
				label="Import Titles..."
				onClick={() => {
					setShowImportDialog(true);
				}}
			/>
			<ImportTitlesDialog
				visible={showImportDialog}
				onHide={() => {
					setShowImportDialog(false);
				}}
			/>
		</div>
	);
}

export default TitlesPage;
