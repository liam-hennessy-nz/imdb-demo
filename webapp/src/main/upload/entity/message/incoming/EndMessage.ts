import type { IncomingMessage } from './IncomingMessage.ts';

export interface EndMessage extends IncomingMessage {
	type: 'end';
}
