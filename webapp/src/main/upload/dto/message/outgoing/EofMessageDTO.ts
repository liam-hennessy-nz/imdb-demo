import type { OutgoingMessageDTO } from './OutgoingMessageDTO.ts';

export interface EofMessageDTO extends OutgoingMessageDTO {
	type: 'eof';
	uuid: string;
}
