type UploadStatus = Record<
	string,
	{ label: string; severity: Severity; isChooseDisabled: boolean; isUploadDisabled: boolean }
>;
type Severity = 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined;

export const UPLOAD_STATUS = {
	inactive: {
		label: 'Inactive',
		severity: 'secondary',
		isChooseDisabled: false,
		isUploadDisabled: true,
	},
	staging: {
		label: 'Staging...',
		severity: 'warning',
		isChooseDisabled: true,
		isUploadDisabled: true,
	},
	stageError: {
		label: 'Stage Error',
		severity: 'danger',
		isChooseDisabled: false,
		isUploadDisabled: true,
	},
	staged: {
		label: 'Staged',
		severity: 'info',
		isChooseDisabled: false,
		isUploadDisabled: false,
	},
	uploading: {
		label: 'Uploading...',
		severity: 'secondary',
		isChooseDisabled: true,
		isUploadDisabled: true,
	},
	uploadError: {
		label: 'Upload Error',
		severity: 'danger',
		isChooseDisabled: false,
		isUploadDisabled: false,
	},
	processing: {
		label: 'Processing...',
		severity: 'info',
		isChooseDisabled: true,
		isUploadDisabled: true,
	},
	completed: {
		label: 'Completed',
		severity: 'success',
		isChooseDisabled: false,
		isUploadDisabled: false,
	},
} as const satisfies UploadStatus;
