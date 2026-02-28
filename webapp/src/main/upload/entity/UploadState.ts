import type { DatasetKey } from '../../shared/entity/Datasets.ts';
import type { Upload } from './Upload.ts';

export type UploadState = Record<DatasetKey, Partial<Upload> | undefined>;
