import { createContext, use } from 'react';
import type { DatasetKey } from '../../../../shared/entity/Datasets.ts';
import type { ConfigMessage } from '../../../entity/message/incoming/ConfigMessage.ts';
import type { Upload } from '../../../entity/Upload.ts';
import type { UploadRecord } from '../../../entity/UploadRecord.ts';
import type { UploadStatus } from '../../../entity/UploadStatus.ts';
import type { UploadContextType } from './UploadProvider.tsx';

/**
 * Create context for {@link UploadProvider}.
 */
export const UploadContext = createContext<UploadContextType | undefined>(undefined);

/**
 * Hook for accessing {@link UploadContext}.
 */
export function useUpload() {
	const context = use(UploadContext);
	if (context === undefined) throw new Error('useUpload must be used within UploadProvider');

	return context;
}

export type UploadAction =
	| { type: 'UPLOADS_CLEARED' }
	| { type: 'UPLOAD_ADDED'; datasetKey: DatasetKey; upload: Upload }
	| { type: 'UPLOAD_UPDATED'; datasetKey: DatasetKey; uploadPart: Partial<Upload> }
	| { type: 'UPLOAD_REMOVED'; datasetKey: DatasetKey }
	| { type: 'FILE_UPDATED'; datasetKey: DatasetKey; file: File }
	| { type: 'CONFIG_UPDATED'; datasetKey: DatasetKey; config: ConfigMessage }
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

		case 'CHUNK_SENT': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				info: {
					...upload.info,
					chunkAcks: { ...upload.info.chunkAcks, [action.chunk]: false },
				},
			}));
		}

		case 'CHUNK_ACKED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				info: {
					...upload.info,
					chunkAcks: { ...upload.info.chunkAcks, [action.chunk]: true },
				},
			}));
		}

		case 'CHUNKS_UPDATED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				info: {
					...upload.info,
					chunkAcks: { ...upload.info.chunkAcks, ...action.chunks },
				},
			}));
		}

		case 'STATUS_UPDATED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				info: {
					...upload.info,
					status: action.status,
				},
			}));
		}

		case 'ERROR_OCCURRED': {
			return updateUpload(state, action.datasetKey, (upload) => ({
				...upload,
				info: {
					...upload.info,
					status: 'stageError',
					errorMessage: action.errorMessage,
				},
			}));
		}
	}
}
