import { useCallback, useEffect, useMemo, useReducer, type Dispatch, type PropsWithChildren } from 'react';
import { STORAGE } from '../../../../shared/constant/constants.ts';
import type { DatasetKey } from '../../../../shared/entity/Datasets.ts';
import { useStorage } from '../../../../storage/context/StorageContext.ts';
import type { Upload } from '../../../entity/Upload.ts';
import type { UploadRecord } from '../../../entity/UploadRecord.ts';
import { UploadContext, uploadsReducer, type UploadAction } from './UploadContext.ts';

export interface UploadContextType {
	uploads: UploadRecord;
	dispatch: Dispatch<UploadAction>;
	find: (datasetKey: DatasetKey | null) => Upload | null;
}

export function UploadProvider({ children }: PropsWithChildren) {
	const storageCtx = useStorage();
	const [uploads, dispatch] = useReducer(
		uploadsReducer,
		(storageCtx.find(STORAGE.KEYS.DATASET_UPLOADS) as UploadRecord | null) ?? {}
	);

	/**
	 * Function attempts to get an Upload object from the UploadContext.
	 * @param datasetKey The dataset key of the Upload to get from the context.
	 * @return If found, the Upload. Otherwise, `null`.
	 */
	const find = useCallback(
		(datasetKey: DatasetKey | null): Upload | null => {
			if (datasetKey === null) return null;
			return uploads[datasetKey] ?? null;
		},
		[uploads]
	);

	useEffect(() => {
		storageCtx.set(STORAGE.KEYS.DATASET_UPLOADS, JSON.stringify(uploads));
	}, [uploads, storageCtx]);

	const value: UploadContextType = useMemo(() => {
		return {
			uploads,
			dispatch,
			find,
		};
	}, [uploads, find]);

	return <UploadContext value={value}>{children}</UploadContext>;
}
