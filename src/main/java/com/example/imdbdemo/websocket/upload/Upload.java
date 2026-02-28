package com.example.imdbdemo.websocket.upload;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "uploads")
public class Upload {
	@Id
	@Column
	private UUID id;
	@Column
	@NotNull
	private String datasetKey;
	@Column
	@NotNull
	private Instant createdDate;
	@Column
	@NotNull
	private int chunkByteSize;
	@Column
	@NotNull
	private int chunkAckInterval;
	@Column
	@NotNull
	private int chunkInFlightMax;
	@Column
	@NotNull
	private long byteSize;
	@Column
	@NotNull
	private long lastModified;
}
