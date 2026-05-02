import type { IncomingMessageDTO } from './IncomingMessageDTO.ts';

export interface ErrorMessageDTO extends IncomingMessageDTO {
	type: 'err';
	code: number;
	reason: string;
}
