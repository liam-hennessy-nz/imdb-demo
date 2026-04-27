import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { ChangeEvent } from 'react';
import { useAppContext } from '../app/context/AppContext.ts';
import { parseErrorMessage } from '../shared/util/commonFunctions.ts';
import { devLog } from '../shared/util/devLog.ts';
import { useUploadContext } from '../upload/context/UploadContext.ts';
import type { Upload } from '../upload/entity/Upload.ts';
import { parseDatasetKey } from '../upload/service/uploadHelper.ts';
import type { DatasetKey } from './entity/Datasets.ts';

export function DatasetPage() {
	const appCtx = useAppContext();
	const uploadCtx = useUploadContext();

	async function handleUpload(ev: ChangeEvent<HTMLInputElement>) {
		const file = ev.target.files?.[0];
		if (file === undefined) return;

		// Validate selected file
		let datasetKey: DatasetKey;
		try {
			datasetKey = await parseDatasetKey(file);
		} catch (ex) {
			devLog.error(`Failed to validate selected file: ${parseErrorMessage(ex)}`);
			return;
		}
		// Add new upload to UploadContext
		const uploadPart: Upload = {
			file: file,
			chunkAcks: {},
			status: 'inactive',
			isVisible: true,
		};
		uploadCtx.dispatch({ type: 'UPLOAD_UPDATED', datasetKey, uploadPart });
		appCtx.setUploadDrawerOpen(true);
	}

	return (
		<Box sx={{ display: 'flex', flex: 1 }}>
			<Button variant="contained" component="label" startIcon={<FileUploadIcon />}>
				Upload
				<input type="file" hidden onChange={(ev) => void handleUpload(ev)} />
			</Button>
		</Box>
	);
}
