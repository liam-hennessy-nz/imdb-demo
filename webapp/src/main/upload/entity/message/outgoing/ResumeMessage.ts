import type { OutgoingMessage } from './OutgoingMessage.ts';

export interface ResumeMessage extends OutgoingMessage {
	type: 'res';
	uuid: string;
	fileName: string;
	byteSize: number;
	lastModified: number;
}
