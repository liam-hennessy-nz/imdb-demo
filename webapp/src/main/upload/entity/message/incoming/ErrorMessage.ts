import type { IncomingMessage } from './IncomingMessage.ts';

export interface ErrorMessage extends IncomingMessage {
	type: 'err';
	code: number;
	reason: string;
}
