import type { StoredFilterModel } from '../../shared/component/table/StoredFilterModel.ts';
import type { StoredUploadRecord } from '../../upload/entity/UploadRecord.ts';

export interface StorageMap {
	isDarkModeEnabled: boolean;
	datasetUploads: StoredUploadRecord;
	filters: StoredFilterModel[];
}

export type StorageMapKey = keyof StorageMap;

export type FindType<K extends StorageMapKey, T extends boolean> = T extends true
	? StorageMap[K] | string | null
	: StorageMap[K] | null;
