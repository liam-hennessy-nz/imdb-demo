export interface FileMetadata {
	type: string;
	fileName: string;
	size: number;
	lastModified: number;
	ackInterval: number;
	totalChunks: number;
}
