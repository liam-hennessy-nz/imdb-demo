import type { IncomingMessageDTO } from './IncomingMessageDTO.ts';

export interface AckMessageDTO extends IncomingMessageDTO {
	type: 'ack';
	chunkIndex: number;
}
