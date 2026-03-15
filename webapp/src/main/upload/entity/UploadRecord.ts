import type { DatasetKey } from '../../shared/entity/Datasets.ts';
import type { Upload } from './Upload.ts';

export type UploadRecord = Partial<Record<DatasetKey, Upload>>;
