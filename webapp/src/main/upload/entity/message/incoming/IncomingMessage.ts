export interface IncomingMessage {
	type: 'cfg' | 'ack' | 'err' | 'end';
}
