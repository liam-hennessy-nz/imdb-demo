import type { DatasetKey } from '../../../shared/entity/Datasets.ts';
import type { Upload } from '../../entity/Upload.ts';
import { useUploadSocket } from '../hook/useUploadSocket.ts';

interface UploadItemProps {
	datasetKey: DatasetKey;
	upload: Upload;
}

export function UploadItem(props: UploadItemProps) {
	const { datasetKey, upload } = props;

	const uploadSocket = useUploadSocket({ datasetKey });

	return (
		<div className="flex flex-1">
			<div className="flex flex-1">{upload.file.name}</div>
			<div className="flex ml-auto">{upload.info.status}</div>
		</div>
	);
}
