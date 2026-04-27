import type { ConfigMessage } from './message/incoming/ConfigMessage.ts';
import type { UploadStatus } from './UploadStatus.ts';

interface FileMetadata {
	name: string;
	size: number;
	lastModified: number;
}

export interface BaseUpload {
	status: UploadStatus;
	chunkAcks: Partial<Record<number, boolean>>;
	config?: ConfigMessage;
	errorMessage?: string;
}

export interface Upload extends BaseUpload {
	file?: File;
	isVisible?: boolean;
}

export interface StoredUpload extends BaseUpload {
	file: FileMetadata;
}
