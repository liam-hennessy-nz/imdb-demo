import { ChevronDownIcon, ChevronUpIcon } from '@primereact/icons';
import { Button } from '@primereact/ui/button';
import { Popover } from '@primereact/ui/popover';
import { useApp } from '../../../shared/context/AppContext/AppContext.ts';
import type { DatasetKey } from '../../../shared/entity/Datasets.ts';
import type { Upload } from '../../entity/Upload.ts';
import { useUpload } from '../context/uploadContext/UploadContext.ts';
import { UploadItem } from './UploadItem.tsx';

export function UploadPopover() {
	const { isUploadsVisible, setUploadsVisible } = useApp();
	const uploadCtx = useUpload();

	function handleClose() {
		setUploadsVisible(false);
	}

	function handleUploadsClick() {
		setUploadsVisible(!isUploadsVisible);
	}

	return (
		<Popover.Root open={isUploadsVisible} onHide={handleClose}>
			<Popover.Trigger>
				<Button className="w-8 h-8" onClick={handleUploadsClick}>
					{isUploadsVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
				</Button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner side="bottom" align="end" sideOffset={8}>
					<Popover.Popup>
						<Popover.Content className="flex flex-col w-80">
							<div className="flex flex-1 mb-2">
								<div className="flex flex-1">File</div>
								<div className="flex ml-auto">Status</div>
							</div>
							{(Object.entries(uploadCtx.uploads) as [DatasetKey, Upload][]).map(([datasetKey, upload]) => {
								const key = `upload_item-${datasetKey}`;
								return <UploadItem key={key} datasetKey={datasetKey} upload={upload} />;
							})}
						</Popover.Content>
						<Popover.Close></Popover.Close>
						<Popover.Arrow />
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}
