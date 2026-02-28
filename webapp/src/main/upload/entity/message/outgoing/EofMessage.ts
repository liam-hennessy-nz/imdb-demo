import type { OutgoingMessage } from './OutgoingMessage.ts';

export interface EofMessage extends OutgoingMessage {
	type: 'eof';
	uuid: string;
}
