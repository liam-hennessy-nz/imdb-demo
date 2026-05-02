import type { DatasetKey } from '../../dataset/entity/Datasets.ts';
import type { ConfigMessageDTO } from '../dto/message/incoming/ConfigMessageDTO.ts';
import type { Upload } from '../entity/Upload.ts';
import type { UploadRecord } from '../entity/UploadRecord.ts';
import type { UploadStatus } from '../entity/UploadUiConfig.ts';

export type UploadAction =
	| { type: 'UPLOADS_CLEARED' }
	| { type: 'UPLOAD_ADDED'; datasetKey: DatasetKey; upload: Upload }
	| { type: 'UPLOAD_UPDATED'; datasetKey: DatasetKey; uploadPart: Partial<Upload> }
	| { type: 'UPLOAD_REMOVED'; datasetKey: DatasetKey }
	| { type: 'FILE_UPDATED'; datasetKey: DatasetKey; file: File }
	| { type: 'CONFIG_UPDATED'; datasetKey: DatasetKey; config: ConfigMessageDTO }
	| { type: 'CONFIG_REMOVED'; datasetKey: DatasetKey }
	| { type: 'CHUNK_SENT'; datasetKey: DatasetKey; chunk: number }
	| { type: 'CHUNK_ACKED'; datasetKey: DatasetKey; chunk: number }
	| { type: 'CHUNKS_UPDATED'; datasetKey: DatasetKey; chunks: Record<number, boolean> }
	| { type: 'STATUS_UPDATED'; datasetKey: DatasetKey; status: UploadStatus }
	| { type: 'ERROR_OCCURRED'; datasetKey: DatasetKey; errorMessage: string; status: UploadStatus };

function updateUpload(state: UploadRecord, datasetKey: DatasetKey, updater: (upload: Upload) => Upload) {
	const upload = state[datasetKey];
	if (upload === undefined) return state;

	return { ...state, [datasetKey]: updater(upload) };
}

export function uploadsReducer(state: UploadRecord, action: UploadAction): UploadRecord {
	switch (action.type) {
		case 'UPLOADS_CLEARED': {
			return {};
		}

		case 'UPLOAD_ADDED': {
			return { ...state, [action.datasetKey]: action.upload };
		}

		case 'UPLOAD_UPDATED': {
			return { ...state, [action.datasetKey]: { ...state[action.datasetKey], ...action.uploadPart } };
		}

		case 'UPLOAD_REMOVED': {
			return Object.fromEntries(Object.entries(state).filter(([key]) => key !== action.datasetKey));
		}

		case 'FILE_UPDATED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				file: action.file,
			}));
		}

		case 'CONFIG_UPDATED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				config: action.config,
			}));
		}

		case 'CONFIG_REMOVED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				config: undefined,
			}));
		}

		case 'CHUNK_SENT': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				chunkAcks: { ...upload.chunkAcks, [action.chunk]: false },
			}));
		}

		case 'CHUNK_ACKED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				chunkAcks: { ...upload.chunkAcks, [action.chunk]: true },
			}));
		}

		case 'CHUNKS_UPDATED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				chunkAcks: { ...upload.chunkAcks, ...action.chunks },
			}));
		}

		case 'STATUS_UPDATED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				status: action.status,
			}));
		}

		case 'ERROR_OCCURRED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				status: 'verifyError',
				errorMessage: action.errorMessage,
			}));
		}
	}
}
