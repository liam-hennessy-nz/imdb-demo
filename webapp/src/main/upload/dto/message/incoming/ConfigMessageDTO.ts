import type { IncomingMessageDTO } from './IncomingMessageDTO.ts';

export interface ConfigMessageDTO extends IncomingMessageDTO {
	type: 'cfg';
	uuid: string;
	chunkIndex: number;
	chunkByteSize: number;
	chunkAckInterval: number;
	chunkInFlightMax: number;
}
