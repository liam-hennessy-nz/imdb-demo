import type { UPLOAD_STATUS } from '../../shared/constant/uploadStatus.ts';
import type { UploadStatus } from './UploadStatus.ts';

export type UploadStatusSeverity<S extends UploadStatus> = (typeof UPLOAD_STATUS)[S]['severity'][number];
