import { useCallback, useEffect, useMemo, useReducer, type Dispatch, type PropsWithChildren } from 'react';
import type { DatasetKey } from '../../dataset/entity/Datasets.ts';
import { STORAGE } from '../../shared/constant/constants.ts';
import { useLatest } from '../../shared/util/useLatest.ts';
import { useStorageContext } from '../../storage/context/StorageContext.ts';
import type { Upload } from '../entity/Upload.ts';
import type { UploadRecord } from '../entity/UploadRecord.ts';
import type { UploadStatus } from '../entity/UploadStatus.ts';
import { getChunkAckedCount, getChunkTotalCount, getChunkUnackedCount } from '../service/uploadHelper.ts';
import { UploadContext } from './UploadContext.ts';
import { uploadsReducer, type UploadAction } from './uploadsReducer.ts';

export interface UploadContextState {
	uploads: UploadRecord;
	dispatch: Dispatch<UploadAction>;
	find: (datasetKey: DatasetKey | null) => Upload | null;
	getUploadStatus: (datasetKey: DatasetKey) => UploadStatus | null;
	getUploadChunkTotalCount: (datasetKey: DatasetKey) => number;
	getUploadChunkAckedCount: (datasetKey: DatasetKey) => number;
	getUploadChunkUnackedCount: (datasetKey: DatasetKey) => number;
}

export function UploadProvider({ children }: PropsWithChildren) {
	const storageCtx = useStorageContext();

	const [uploads, dispatch] = useReducer(
		uploadsReducer,
		(storageCtx.find(STORAGE.KEYS.DATASET_UPLOADS) as UploadRecord | null) ?? {}
	);

	const uploadsRef = useLatest(uploads);

	/**
	 * Function attempts to get an Upload object from the UploadContext.
	 * @param datasetKey The dataset key of the Upload to get from the context.
	 * @return If found, the Upload. Otherwise, `null`.
	 */
	const find = useCallback(
		(datasetKey: DatasetKey | null): Upload | null => {
			if (datasetKey === null) return null;
			return uploadsRef.current[datasetKey] ?? null;
		},
		[uploadsRef]
	);

	const getUploadStatus = useCallback(
		(datasetKey: DatasetKey) => {
			return find(datasetKey)?.status ?? null;
		},
		[find]
	);

	const getUploadChunkTotalCount = useCallback(
		(datasetKey: DatasetKey) => {
			return getChunkTotalCount(find(datasetKey));
		},
		[find]
	);

	const getUploadChunkAckedCount = useCallback(
		(datasetKey: DatasetKey) => {
			return getChunkAckedCount(find(datasetKey));
		},
		[find]
	);

	const getUploadChunkUnackedCount = useCallback(
		(datasetKey: DatasetKey) => {
			return getChunkUnackedCount(find(datasetKey));
		},
		[find]
	);

	useEffect(() => {
		// Whenever uploads change, save to LocalStorage
		storageCtx.set(
			STORAGE.KEYS.DATASET_UPLOADS,
			JSON.stringify(uploads, (key, value: unknown) => {
				// Use replacer to exclude fields that should not be persisted
				if (key === 'file' && value instanceof File) {
					return {
						name: value.name,
						size: value.size,
						lastModified: value.lastModified,
					};
				}
				if (key === 'isVisible') return undefined;
				return value;
			})
		);
	}, [uploads, storageCtx]);

	const value: UploadContextState = useMemo(() => {
		return {
			uploads,
			dispatch,
			find,
			getUploadStatus,
			getUploadChunkTotalCount,
			getUploadChunkAckedCount,
			getUploadChunkUnackedCount,
		};
	}, [uploads, find, getUploadStatus, getUploadChunkTotalCount, getUploadChunkAckedCount, getUploadChunkUnackedCount]);

	return <UploadContext value={value}>{children}</UploadContext>;
}
