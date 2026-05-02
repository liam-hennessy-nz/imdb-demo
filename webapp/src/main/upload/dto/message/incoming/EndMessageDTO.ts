import type { IncomingMessageDTO } from './IncomingMessageDTO.ts';

export interface EndMessageDTO extends IncomingMessageDTO {
	type: 'end';
}
