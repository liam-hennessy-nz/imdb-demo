package com.example.imdbdemo.websocket.upload.dto.messages.outgoing;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = ConfigMessageDTO.class, name = "cfg"),
	@JsonSubTypes.Type(value = AckMessageDTO.class, name = "ack"),
	@JsonSubTypes.Type(value = ErrorMessageDTO.class, name = "err"),
	@JsonSubTypes.Type(value = EndMessageDTO.class, name = "end")
})
public sealed interface OutgoingMessageDTO permits ConfigMessageDTO, AckMessageDTO, ErrorMessageDTO, EndMessageDTO {
	String type();
}
