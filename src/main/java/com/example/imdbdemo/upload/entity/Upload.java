package com.example.imdbdemo.upload.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Upload {

	@Id
	@Column
	private UUID uuid;

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
	private String fileName;

	@Column
	@NotNull
	private long byteSize;

	@Column
	@NotNull
	private long lastModified;
}
