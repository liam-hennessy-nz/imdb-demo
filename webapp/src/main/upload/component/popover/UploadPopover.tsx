import { ChevronDownIcon, ChevronUpIcon } from '@primereact/icons';
import { Button } from '@primereact/ui/button';
import { Popover } from '@primereact/ui/popover';
import { useEffect, useState } from 'react';
import { useApp } from '../../../shared/context/AppContext/useApp.ts';
import { useUpload } from '../../context/uploadContext/useUpload.ts';
import type { UploadState } from '../../entity/UploadState.ts';

export function UploadPopover() {
	const { isUploadsVisible, setUploadsVisible } = useApp();
	const uploadCtx = useUpload();

	const [uploadState, setUploadState] = useState<UploadState>({} as UploadState);

	function handleClose() {
		setUploadsVisible(false);
	}

	function handleUploadsClick() {
		setUploadsVisible(!isUploadsVisible);
	}

	useEffect(() => {
		if (!isUploadsVisible) return;

		const interval = setInterval(() => {
			// TODO: Complete this
			setUploadState(uploadCtx.uploadStatesRef.current);
		}, 50);
		return () => {
			clearInterval(interval);
		};
	}, [isUploadsVisible, uploadCtx.uploadStatesRef]);

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
							{Object.values(uploadState).map((value, index) => {
								const key = `upload-${index}`;
								return <div key={key}>{value?.file?.name ?? 'Unknown'}</div>;
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
