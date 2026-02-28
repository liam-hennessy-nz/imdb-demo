import type { ConfigMessage } from './message/incoming/ConfigMessage.ts';
import type { UploadStatus } from './UploadStatus.ts';

export interface Upload {
	file: File;
	config: ConfigMessage;
	info: {
		chunkAcks: Record<number, boolean | undefined>;
		status: UploadStatus;
		errorMessage?: string;
	};
}
