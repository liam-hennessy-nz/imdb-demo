package com.example.imdbdemo.websocket.upload.dto.messages.incoming;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = MetadataMessageDTO.class, name = "meta"),
	@JsonSubTypes.Type(value = ResumeMessageDTO.class, name = "res"),
	@JsonSubTypes.Type(value = EofMessageDTO.class, name = "eof")
})
public sealed interface IncomingMessageDTO permits MetadataMessageDTO, ResumeMessageDTO, EofMessageDTO {
	String type();
}
