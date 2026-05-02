import type { OutgoingMessageDTO } from './OutgoingMessageDTO.ts';

export interface ResumeMessageDTO extends OutgoingMessageDTO {
	type: 'res';
	uuid: string;
	fileName: string;
	byteSize: number;
	lastModified: number;
}
