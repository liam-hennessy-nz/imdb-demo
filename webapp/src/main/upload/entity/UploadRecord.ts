import type { DatasetKey } from '../../dataset/entity/Dataset.ts';
import type { StoredUpload, Upload } from './Upload.ts';

export type UploadRecord = Partial<Record<DatasetKey, Upload>>;

export type StoredUploadRecord = Partial<Record<DatasetKey, StoredUpload>> | null;
