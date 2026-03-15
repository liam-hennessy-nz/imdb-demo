import type { ConfigMessage } from './message/incoming/ConfigMessage.ts';
import type { UploadStatus } from './UploadStatus.ts';

export interface Upload {
	file: {
		name: string;
		size: number;
		lastModified: number;
	};
	info: {
		status: UploadStatus;
		chunkAcks: Partial<Record<number, boolean>>;
		errorMessage?: string;
	};
	config?: ConfigMessage;
}
