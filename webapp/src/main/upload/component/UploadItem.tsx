import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { DatasetKey } from '../../dataset/entity/Datasets.ts';
import { formatBytes } from '../../shared/util/commonFunctions.ts';
import { useStorageContext } from '../../storage/context/StorageContext.ts';
import { useUploadContext } from '../context/UploadContext.ts';
import type { Upload } from '../entity/Upload.ts';
import { getChunkProgress, getUploadUiConfig } from '../service/uploadHelper.ts';
import { uploadService } from '../service/uploadService.ts';

interface UploadItemProps {
	datasetKey: DatasetKey;
	upload: Upload & { file: File; isVisible: true };
}

export function UploadItem(props: UploadItemProps) {
	const { datasetKey, upload } = props;

	const uploadCtx = useUploadContext();
	const storageCtx = useStorageContext();

	const uploadTask = uploadService({
		uploadCtx,
		storageCtx,
		datasetKey,
	});

	async function handleActionButtonClick() {
		switch (getUploadUiConfig(upload).action) {
			case 'upload': {
				await uploadTask.upload();
				break;
			}
			case 'resume': {
				uploadTask.resume();
				break;
			}
			case 'pause': {
				uploadTask.pause();
				break;
			}
			case 'retry': {
				await uploadTask.retry();
				break;
			}
			default: {
				break;
			}
		}
	}

	function handleCancelButtonClick() {
		uploadTask.cancel();
	}

	function actionButtonTemplate() {
		const uiConfig = getUploadUiConfig(upload);
		const Icon = uiConfig.component.icon;

		return (
			<Tooltip title={uiConfig.component.tooltipTitle}>
				<IconButton onClick={() => void handleActionButtonClick()} disabled={uiConfig.action === 'disabled'}>
					<Icon color={uiConfig.component.iconColour} />
				</IconButton>
			</Tooltip>
		);
	}

	function cancelButtonTemplate() {
		const uiConfig = getUploadUiConfig(upload);

		return (
			<IconButton onClick={handleCancelButtonClick} disabled={!uiConfig.isCancellable}>
				<CancelIcon color={uiConfig.isCancellable ? 'error' : 'disabled'} />
			</IconButton>
		);
	}

	function progressLabelTemplate() {
		const uiConfig = getUploadUiConfig(upload);
		const label = upload.status !== 'uploading' ? uiConfig.label : `${uiConfig.label} (${getChunkProgress(upload)}%)`;

		return <Typography variant="caption">{label}</Typography>;
	}

	function progressBarTemplate() {
		const uiConfig = getUploadUiConfig(upload);

		return <LinearProgress variant={uiConfig.component.progressVariant} value={getChunkProgress(upload)} />;
	}

	return (
		<Stack direction="row" spacing={1} sx={{ flex: 1 }}>
			<Stack spacing={1} sx={{ flex: 1 }}>
				<Typography>{datasetKey}</Typography>

				<Stack direction="row" sx={{ justifyContent: 'space-between' }}>
					<Typography variant="caption" color="textSecondary">
						{formatBytes(upload.file.size)}
					</Typography>

					{progressLabelTemplate()}
				</Stack>

				{progressBarTemplate()}
			</Stack>

			<Stack direction="row" sx={{ alignItems: 'end' }}>
				{actionButtonTemplate()}

				{cancelButtonTemplate()}
			</Stack>
		</Stack>
	);
}
