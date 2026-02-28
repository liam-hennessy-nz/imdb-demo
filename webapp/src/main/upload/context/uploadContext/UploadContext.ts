import { createContext, type RefObject } from 'react';
import type { DatasetKey } from '../../../shared/entity/Datasets.ts';
import type { Upload } from '../../entity/Upload.ts';
import type { UploadState } from '../../entity/UploadState.ts';

export interface UploadContextType {
	uploadStatesRef: RefObject<UploadState>;
	find: (datasetKey: DatasetKey) => Partial<Upload> | null;
	add: (datasetKey: DatasetKey, uploadRef: Partial<Upload>) => void;
	remove: (datasetKey: DatasetKey) => void;
	clear: () => void;
}

/**
 * This context is used to store information about partial database uploads. Each upload is mapped to a
 * {@link DatasetKey}, so that only one active upload runs per dataset.
 */
export const UploadContext = createContext<UploadContextType | undefined>(undefined);
