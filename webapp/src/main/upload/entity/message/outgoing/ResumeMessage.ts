import type { OutgoingMessage } from './OutgoingMessage.ts';

export interface ResumeMessage extends OutgoingMessage {
	type: 'res';
	uuid: string;
}
