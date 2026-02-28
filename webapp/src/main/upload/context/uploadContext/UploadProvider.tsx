import { useRef, type PropsWithChildren } from 'react';
import type { DatasetKey } from '../../../shared/entity/Datasets.ts';
import type { Upload } from '../../entity/Upload.ts';
import type { UploadState } from '../../entity/UploadState.ts';
import { UploadContext, type UploadContextType } from './UploadContext.ts';

export function UploadProvider({ children }: PropsWithChildren) {
	const statesRef = useRef<UploadState>({} as UploadState);

	/**
	 * Function attempts to get an Upload object from the UploadContext.
	 * @param datasetKey The dataset key of the Upload to get from the context.
	 * @return If found, the Upload. Otherwise, `null`.
	 */
	function find(datasetKey: DatasetKey | null): Partial<Upload> | null {
		if (datasetKey === null) return null;
		return statesRef.current[datasetKey] ?? null;
	}

	/**
	 * Function stores an Upload in the UploadContext, mapped by its dataset key.
	 * @param datasetKey The dataset key of the Upload to add to the context.
	 * @param upload The Upload to store in the context.
	 */
	function add(datasetKey: DatasetKey, upload: Partial<Upload>) {
		statesRef.current[datasetKey] = upload;
	}

	/**
	 * Function removes an Upload from the UploadContext.
	 * @param datasetKey The dataset key of the Upload to remove from the context.
	 */
	function remove(datasetKey: DatasetKey) {
		statesRef.current = Object.fromEntries(
			Object.entries(statesRef.current).filter(([key]) => key !== datasetKey)
		) as UploadState;
	}

	/**
	 * Function clears the UploadContext, removing all stored Uploads.
	 */
	function clear() {
		statesRef.current = {} as UploadState;
	}

	const value: UploadContextType = {
		uploadStatesRef: statesRef,
		find,
		add,
		remove,
		clear,
	};

	return <UploadContext value={value}>{children}</UploadContext>;
}
