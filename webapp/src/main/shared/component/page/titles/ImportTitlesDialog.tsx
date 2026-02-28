/*
import { Badge } from '@primereact/ui/badge';
import { Button } from '@primereact/ui/button';
import { Dialog } from '@primereact/ui/dialog';
import {
	FileUpload,
	type FileUploadErrorEvent,
	type FileUploadHeaderTemplateOptions,
	type FileUpload as FileUploadRef,
	type FileUploadSelectEvent,
	type FileUploadUploadEvent,
	type ItemTemplateOptions,
} from '@primereact/ui/fileupload';
import { ProgressBar } from '@primereact/ui/progressbar';
import { Tooltip } from '@primereact/ui/tooltip';
import { useEffect, useRef, useState } from 'react';
import { parseErrorMessage } from '../../../shared/commonFunctions.ts';
import { API } from '../../../shared/constant/api.ts';
import { UPLOAD_STATUS } from '../../../shared/constant/uploadStatus.ts';
import { devLog } from '../../../shared/util/devLog.ts';
import type { UploadStatus } from '../../../upload/entity/UploadStatus.ts';
import useUploadSocket from '../../../upload/hook/useUploadSocket.ts';

interface ImportTitlesDialogProps {
	visible: boolean;
	onHide: (error?: Error) => void;
}

function ImportTitlesDialog({ visible, onHide }: ImportTitlesDialogProps) {
	const uploadSocket = useUploadSocket({
		url: API.WEBSOCKET_UPLOAD_URL,
		onStatusChange: handleStatusChange,
		onError: handleUploadError,
	});

	const fileUploadRef = useRef<FileUploadRef | null>(null);

	const [uploadStatus, setUploadStatus] = useState<UploadStatus>('inactive');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function uploadHandler() {
		try {
			await uploadSocket.sendDatasetFile();
		} catch (ex) {
			devLog.error(`Failed to upload dataset: ${parseErrorMessage(ex)}`);
		}
	}

	function handleStatusChange(status: UploadStatus) {
		setUploadStatus(status);
	}

	function handleUploadError(msg: string) {
		setErrorMessage(msg);
	}

	async function handleSelect(ev: FileUploadSelectEvent) {
		if (fileUploadRef.current === null) throw new Error('Attempted to upload file without FileUpload ref initialising');
		const file = ev.files[0];

		try {
			await uploadSocket.stageDatasetFile(file);
		} catch (ex) {
			devLog.error(`Failed to stage file '${file.name}': ${parseErrorMessage(ex)}`);
			fileUploadRef.current.clear();
			return;
		}
	}

	function handleRemove() {
		fileUploadRef.current?.clear();
	}

	function handleUpload(ev: FileUploadUploadEvent) {
		devLog.debug('Success:', ev.files);
	}

	function handleFileError(ev: FileUploadErrorEvent) {
		devLog.debug('Error:', ev);
	}

	useEffect(() => {
		if (!visible) return;
	}, [visible]);

	useEffect(() => {
		return () => {
			setUploadStatus('inactive');
			fileUploadRef.current = null;
		};
	}, []);

	function headerTemplate(options: FileUploadHeaderTemplateOptions) {
		// Casting here to avoid 'error typed value' linting warnings
		const chooseProps = (options.chooseButton as Button).props;
		const uploadProps = (options.uploadButton as Button).props;
		const cancelProps = (options.cancelButton as Button).props;

		const isChooseDisabled = UPLOAD_STATUS[uploadStatus].isChooseDisabled;
		const isUploadDisabled = UPLOAD_STATUS[uploadStatus].isUploadDisabled;

		return (
			<div className="p-fileupload-header">
				<span className="p-fileupload-buttonbar">
					<Button {...chooseProps} disabled={isChooseDisabled} />

					<Button
						{...uploadProps}
						tooltip={'Select a file first'}
						tooltipOptions={{ position: 'top', showDelay: 750, disabled: !isUploadDisabled, showOnDisabled: true }}
						disabled={isUploadDisabled}
					/>

					<Button {...cancelProps} />
				</span>
			</div>
		);
	}

	function progressBarTemplate() {
		return <ProgressBar />;
	}

	function itemTemplate(obj: object, options: ItemTemplateOptions) {
		const file = obj as File;

		return (
			<div className="flex flex-column">
				<div className="flex justify-content-between">
					<div className="flex gap-2 align-items-center upload-file-name">
						<i className="pi pi-file" />
						<span>{file.name}</span>
						<Tooltip
							target=".upload-file-name"
							content={`${Math.round(file.size / (1024 * 1024))}MB`}
							showDelay={250}
						/>
					</div>
					<div className="flex gap-1">
						<Badge
							className="upload-file-status"
							value={UPLOAD_STATUS[uploadStatus].label}
							severity={UPLOAD_STATUS[uploadStatus].severity}
						/>
						<Button
							style={{ width: '20px', height: '20px' }}
							icon="pi pi-times"
							onClick={(ev) => {
								options.onRemove(ev);
							}}
						/>
						<Tooltip target=".upload-file-status" content={errorMessage} showDelay={250} />
					</div>
				</div>
			</div>

			/!*			<div className="flex align-items-center w-full">
				<div>{file.name}</div>

				<div>{file.size}</div>

				<Badge
					className="p-fileupload-file-status"
					value={UPLOAD_STATUS[uploadStatus].label}
					severity={UPLOAD_STATUS[uploadStatus].severity}
				/>

				<Button
					className={classNames('p-button-text', 'p-button-danger', 'p-fileupload-file-remove')}
					icon="pi pi-times"
					onClick={(ev) => {
						options.onRemove(ev);
					}}
				/>
			</div>*!/
		);
	}

	return (
		<Dialog visible={visible} onHide={onHide} header="Import Titles">
			<div className="flex gap-3">
				<FileUpload
					ref={fileUploadRef}
					accept=".tsv"
					chooseLabel="Select TSV"
					customUpload
					uploadHandler={() => void uploadHandler()}
					onSelect={(ev) => void handleSelect(ev)}
					onRemove={handleRemove}
					onUpload={handleUpload}
					onError={handleFileError}
					headerTemplate={headerTemplate}
					progressBarTemplate={progressBarTemplate}
					itemTemplate={itemTemplate}
				/>
			</div>
		</Dialog>
	);
}

export default ImportTitlesDialog;
*/
