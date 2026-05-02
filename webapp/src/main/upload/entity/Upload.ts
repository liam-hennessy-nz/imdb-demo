import type { ConfigMessageDTO } from '../dto/message/incoming/ConfigMessageDTO.ts';
import type { UploadStatus } from './UploadUiConfig.ts';

interface FileMetadata {
	name: string;
	size: number;
	lastModified: number;
}

export interface BaseUpload {
	status: UploadStatus;
	chunkAcks: Partial<Record<number, boolean>>;
	config?: ConfigMessageDTO;
	errorMessage?: string;
}

export interface Upload extends BaseUpload {
	file?: File;
	isVisible?: boolean;
}

export interface StoredUpload extends BaseUpload {
	file: FileMetadata;
}
