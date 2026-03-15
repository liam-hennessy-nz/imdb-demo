import type { IncomingMessage } from './IncomingMessage.ts';

export interface ConfigMessage extends IncomingMessage {
	type: 'cfg';
	uuid: string;
	chunkIndex: number;
	chunkByteSize: number;
	chunkAckInterval: number;
	chunkInFlightMax: number;
}
