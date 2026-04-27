import { DATASET_SCHEMA, type DatasetKey } from '../../dataset/entity/Datasets.ts';
import { WEBSOCKET } from '../../shared/constant/constants.ts';
import { readFileSnippet } from '../../shared/service/fileService.ts';
import { newErrorWrap } from '../../shared/util/commonFunctions.ts';
import type { ConfigMessage } from '../entity/message/incoming/ConfigMessage.ts';
import type { IncomingMessage } from '../entity/message/incoming/IncomingMessage.ts';
import type { StoredUpload, Upload } from '../entity/Upload.ts';
import { UPLOAD_UI_CONFIG } from '../entity/UploadUiConfig.ts';

export async function buildChunkByteArray(upload: Upload & { config: ConfigMessage; file: File }, chunkIndex: number) {
	// Start is chunk index x chunk size (from upload config)
	const start = chunkIndex * upload.config.chunkByteSize;
	// End is start + chunk size (from upload config)
	const end = Math.min(start + upload.config.chunkByteSize, upload.file.size);

	// Get chunk data
	const chunk = await upload.file.slice(start, end).arrayBuffer();

	// Header to hold the chunk index (int size)
	const header = new DataView(new ArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
	// Use big-endian here
	header.setUint32(0, chunkIndex, false);

	// Combine chunk index int (32-bit) into chunk data (8-bit) byte array
	const byteArray = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT + chunk.byteLength);
	byteArray.set(new Uint8Array(header.buffer), 0);
	byteArray.set(new Uint8Array(chunk), Uint32Array.BYTES_PER_ELEMENT);

	return byteArray;
}

export function getChunkTotalCount(upload: Upload | null) {
	if (upload?.config === undefined || upload.file === undefined) return 0;
	return Math.ceil(upload.file.size / upload.config.chunkByteSize);
}

export function getChunkUnackedCount(upload: Upload | null) {
	if (upload === null) return 0;
	return Object.values(upload.chunkAcks).filter((chunk) => !chunk).length;
}

export function getChunkAckedCount(upload: Upload | null) {
	if (upload === null) return 0;
	return Object.values(upload.chunkAcks).filter((chunk) => chunk).length;
}

export function getChunkProgress(upload: Upload) {
	const ackedCount = getChunkAckedCount(upload);
	const totalCount = getChunkTotalCount(upload);

	return totalCount === 0 ? 0 : Math.round((ackedCount / totalCount) * 100);
}

/**
 * Function that attempts to find a DatasetName given an array of strings.
 * @param columnArray An array of column header strings.
 * @returns {@link DatasetKey}, if every string in the string array exists in a dataset’s column headers. Order is
 * disregarded.
 * @returns `null`, if the string array does not match any datasets.
 */
export function findDatasetKey(columnArray: string[]): DatasetKey | null {
	for (const dataset of Object.keys(DATASET_SCHEMA) as DatasetKey[]) {
		const { column } = DATASET_SCHEMA[dataset];
		// Get column keys from schema const, sliced to ignore the first (ID) field which won't exist yet
		const columnKeys = Object.keys(column).slice(1);

		if (columnArray.length === columnKeys.length && columnKeys.every((k) => columnArray.includes(k))) {
			return dataset;
		}
	}

	return null;
}

/**
 * Function that attempts to parse a given File for a DatasetName.
 * @param file The file to parse.
 * @returns Resolved {@link DatasetKey} promise, if the file is a valid IMDb dataset.
 * @throws Error if a snippet fails to read from the file.
 * @throws Error if the file is not a valid IMDb dataset.
 */
export async function parseDatasetKey(file: File): Promise<DatasetKey> {
	let headers: string[];
	try {
		headers = await new Promise<string[]>((resolve, reject) => {
			readFileSnippet(file, resolve, reject, 0, WEBSOCKET.VALIDATE.FILE_SNIPPET_SIZE_BYTES);
		});
	} catch (ex) {
		throw newErrorWrap(`Failed to read first ${WEBSOCKET.VALIDATE.FILE_SNIPPET_SIZE_BYTES} bytes`, ex);
	}

	const datasetKey = findDatasetKey(headers);
	if (datasetKey === null) {
		throw new Error(`Columns do not match any IMDb dataset: '${headers.join()}'`);
	}

	return datasetKey;
}

export function parseIncomingMessage(message: string): IncomingMessage {
	let data: unknown;

	// Attempt to parse string
	try {
		data = JSON.parse(message);
	} catch (ex) {
		throw newErrorWrap(`Failed to parse message as JSON`, ex);
	}

	// Validate parsed object has correct IncomingMessage properties
	if (typeof data !== 'object' || data === null || !('type' in data) || typeof data.type !== 'string') {
		throw new Error(`Invalid message: ${message}`);
	}

	return data as IncomingMessage;
}

export function assertUploadIsNotNull(upload: Upload | null): asserts upload is Upload {
	if (upload === null) throw new Error(`Upload is null`);
}

/**
 * Function that asserts an Upload object contains a ConfigMessage.
 * @param upload The Upload object to assert.
 */
export function assertUploadHasConfig(upload: Upload | null): asserts upload is Upload & { config: ConfigMessage } {
	if (upload?.config === undefined) throw new Error(`Upload does not contain a ConfigMessage`);
}

export function assertUploadHasFile(upload: Upload | null): asserts upload is Upload & { file: File } {
	if (upload?.file === undefined) throw new Error(`Upload does not contain a File`);
}

export function assertUploadIsVisible(upload: Upload | null): asserts upload is Upload & { isVisible: true } {
	if (upload?.isVisible !== true) throw new Error(`Upload is not visible`);
}

export function doesUploadMatchStored(upload: Upload, storedUpload: StoredUpload): boolean {
	return (
		upload.file?.name === storedUpload.file.name &&
		upload.file.size === storedUpload.file.size &&
		upload.file.lastModified === storedUpload.file.lastModified
	);
}

export function getUploadUiConfig(upload: Upload) {
	return UPLOAD_UI_CONFIG[upload.status];
}
