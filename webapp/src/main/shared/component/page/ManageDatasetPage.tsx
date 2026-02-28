import { PlusIcon } from '@primereact/icons';
import type { FileUploadHandlerEvent, FileUploadRootInstance } from '@primereact/types/shared/fileupload';
import { Button } from '@primereact/ui/button';
import { FileUpload } from '@primereact/ui/fileupload';
import { useUpload } from '../../../upload/context/uploadContext/useUpload.ts';
import type { Upload } from '../../../upload/entity/Upload.ts';
import { parseDatasetKey } from '../../../upload/service/UploadHelper.ts';
import { parseErrorMessage } from '../../commonFunctions.ts';
import { useApp } from '../../context/AppContext/useApp.ts';
import type { DatasetKey } from '../../entity/Datasets.ts';
import { devLog } from '../../util/devLog.ts';

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
		const upload: Partial<Upload> = {
			file: file,
			info: { chunkAcks: {}, status: 'inactive' },
		};
		uploadCtx.add(datasetKey, upload);
		appCtx.setUploadsVisible(true);
	}

	return (
		<div>
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
