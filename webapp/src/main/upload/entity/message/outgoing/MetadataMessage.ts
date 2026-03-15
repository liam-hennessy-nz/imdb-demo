import type { DatasetKey } from '../../../../shared/entity/Datasets.ts';
import type { OutgoingMessage } from './OutgoingMessage.ts';

export interface MetadataMessage extends OutgoingMessage {
	type: 'meta';
	datasetKey: DatasetKey;
	fileName: string;
	byteSize: number;
	lastModified: number;
}
