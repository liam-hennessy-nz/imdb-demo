import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SyncIcon from '@mui/icons-material/Sync';
import type { LinearProgressProps } from '@mui/material';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ComponentType } from 'react';

type Action = 'upload' | 'pause' | 'resume' | 'retry' | 'disabled';

interface UploadUiConfig {
	label: string;
	action: Action;
	isCancellable: boolean;
	component: {
		icon: ComponentType<SvgIconProps>;
		iconColour: SvgIconProps['color'];
		tooltipTitle: string | null;
		progressVariant: LinearProgressProps['variant'];
	};
}

type UploadUiState = Record<string, UploadUiConfig>;

export const UPLOAD_UI_CONFIG = {
	inactive: {
		label: 'Inactive',
		action: 'upload',
		isCancellable: true,
		component: {
			icon: PlayCircleIcon,
			iconColour: 'info',
			tooltipTitle: 'Upload',
			progressVariant: 'determinate',
		},
	},
	paused: {
		label: 'Paused',
		action: 'resume',
		isCancellable: true,
		component: {
			icon: PlayCircleIcon,
			iconColour: 'info',
			tooltipTitle: 'Resume',
			progressVariant: 'determinate',
		},
	},
	verifying: {
		label: 'Verifying...',
		action: 'disabled',
		isCancellable: true,
		component: {
			icon: SyncIcon,
			iconColour: 'secondary',
			tooltipTitle: null,
			progressVariant: 'indeterminate',
		},
	},
	verifyError: {
		label: 'Verify Error',
		action: 'retry',
		isCancellable: true,
		component: {
			icon: SyncIcon,
			iconColour: 'warning',
			tooltipTitle: 'Retry',
			progressVariant: 'determinate',
		},
	},
	verified: {
		label: 'Verified',
		action: 'disabled',
		isCancellable: true,
		component: {
			icon: PauseCircleIcon,
			iconColour: 'secondary',
			tooltipTitle: null,
			progressVariant: 'determinate',
		},
	},
	uploading: {
		label: 'Uploading...',
		action: 'pause',
		isCancellable: true,
		component: {
			icon: PauseCircleIcon,
			iconColour: 'info',
			tooltipTitle: 'Pause',
			progressVariant: 'determinate',
		},
	},
	uploadError: {
		label: 'Upload Error',
		action: 'retry',
		isCancellable: true,
		component: {
			icon: SyncIcon,
			iconColour: 'warning',
			tooltipTitle: 'Retry',
			progressVariant: 'determinate',
		},
	},
	processing: {
		label: 'Processing...',
		action: 'disabled',
		isCancellable: false,
		component: {
			icon: PauseCircleIcon,
			iconColour: 'disabled',
			tooltipTitle: null,
			progressVariant: 'indeterminate',
		},
	},
	completed: {
		label: 'Completed',
		action: 'retry',
		isCancellable: false,
		component: {
			icon: SyncIcon,
			iconColour: 'warning',
			tooltipTitle: 'Retry',
			progressVariant: 'determinate',
		},
	},
	cancelled: {
		label: 'Cancelled',
		action: 'disabled',
		isCancellable: false,
		component: {
			icon: PlayCircleIcon,
			iconColour: 'disabled',
			tooltipTitle: null,
			progressVariant: 'determinate',
		},
	},
} as const satisfies UploadUiState;
