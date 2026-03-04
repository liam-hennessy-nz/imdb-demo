import { PlusIcon } from '@primereact/icons';
import type { FileUploadHandlerEvent, FileUploadRootInstance } from '@primereact/types/shared/fileupload';
import { Button } from '@primereact/ui/button';
import { Dialog } from '@primereact/ui/dialog';
import { FileUpload } from '@primereact/ui/fileupload';
import { parseErrorMessage } from '../../../shared/commonFunctions.ts';
import type { DatasetKey } from '../../../shared/entity/Datasets.ts';
import { devLog } from '../../../shared/util/devLog.ts';
import { useUpload } from '../../context/uploadContext/UploadContext.ts';
import type { Upload } from '../../entity/Upload.ts';
import { parseDatasetKey } from '../../service/UploadHelper.ts';

interface UploadFileDialogProps {
	visible: boolean;
	onHide: () => void;
}

export function UploadFileDialog(props: UploadFileDialogProps) {
	const { visible, onHide } = props;

	const uploadCtx = useUpload();

	async function handleUpload(ev: FileUploadHandlerEvent) {
		devLog.info('TEST');
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

		onHide();
	}

	return (
		<Dialog.Root visible={visible} accept=".tsv" onHide={onHide} header="Import Dataset">
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
									Browse
								</Button>
							</div>
						);
					}}
				</FileUpload.Root>

				{/*<FileUpload
					ref={fileUploadRef}
					accept=".tsv"
					chooseLabel="Select TSV"
					mode="basic"
					onSelect={(ev) => void handleSelect(ev)}
				/>*/}
			</div>
		</Dialog.Root>
	);
}
