import { PlusIcon } from '@primereact/icons';
import type { FileUploadHandlerEvent, FileUploadRootInstance } from '@primereact/types/shared/fileupload';
import { Button } from '@primereact/ui/button';
import { FileUpload } from '@primereact/ui/fileupload';
import { parseErrorMessage } from '../shared/commonFunctions.ts';
import { useApp } from '../shared/context/AppContext/AppContext.ts';
import type { DatasetKey } from '../shared/entity/Datasets.ts';
import { devLog } from '../shared/util/devLog.ts';
import { useUpload } from '../upload/component/context/uploadContext/UploadContext.ts';
import type { Upload } from '../upload/entity/Upload.ts';
import { parseDatasetKey } from '../upload/service/UploadHelper.ts';

export function ManageDatasetPage() {
	const appCtx = useApp();
	const uploadCtx = useUpload();

	async function handleUpload(ev: FileUploadHandlerEvent) {
		const file = ev.files[0];

		// Validate selected file
		let datasetKey: DatasetKey;
		try {
			datasetKey = await parseDatasetKey(file);
		} catch (ex) {
			devLog.error(`Failed to validate selected file: ${parseErrorMessage(ex)}`);
			return;
		}
		// Add new upload to UploadContext
		const upload: Upload = {
			file: { name: file.name, size: file.size, lastModified: file.lastModified },
			info: { chunkAcks: {}, status: 'inactive' },
		};
		uploadCtx.dispatch({ type: 'UPLOAD_ADDED', datasetKey, upload });
		appCtx.setUploadsVisible(true);
	}

	return (
		<div className="flex flex-1">
			<FileUpload.Root
				accept=".tsv"
				auto
				customUpload
				uploadHandler={(ev: FileUploadHandlerEvent) => void handleUpload(ev)}
			>
				{(instance: FileUploadRootInstance) => {
					return (
						<div className="flex flex-wrap items-center gap-3">
							<Button onClick={instance.choose} severity="secondary" variant="outlined">
								<PlusIcon />
								Import Dataset...
							</Button>
						</div>
					);
				}}
			</FileUpload.Root>
		</div>
	);
}
