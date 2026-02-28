import type { DatasetKey } from '../../../../shared/entity/Datasets.ts';
import type { IncomingMessage } from './IncomingMessage.ts';

export interface ConfigMessage extends IncomingMessage {
	type: 'cfg';
	datasetKey: DatasetKey;
	uuid: string;
	chunkIndex: number;
	chunkByteSize: number;
	chunkAckInterval: number;
	chunkInFlightMax: number;
}
