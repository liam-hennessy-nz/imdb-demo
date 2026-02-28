import type { IncomingMessage } from './IncomingMessage.ts';

export interface AckMessage extends IncomingMessage {
	type: 'ack';
	chunkIndex: number;
}
