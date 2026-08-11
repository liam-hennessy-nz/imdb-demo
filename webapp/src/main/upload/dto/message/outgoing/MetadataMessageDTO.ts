import type { DatasetKey } from '../../../../dataset/entity/Dataset.ts';
import type { OutgoingMessageDTO } from './OutgoingMessageDTO.ts';

export interface MetadataMessageDTO extends OutgoingMessageDTO {
	type: 'meta';
	datasetKey: DatasetKey;
	fileName: string;
	byteSize: number;
	lastModified: number;
}
