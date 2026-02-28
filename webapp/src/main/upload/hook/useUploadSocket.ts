import { useRef } from 'react';
import { parseErrorMessage, sleep, waitForCondition } from '../../shared/commonFunctions.ts';
import { STORAGE, WEBSOCKET } from '../../shared/constant/constants.ts';
import { UPLOAD_ERROR } from '../../shared/constant/uploadError.ts';
import type { DatasetKey } from '../../shared/entity/Datasets.ts';
import { devLog } from '../../shared/util/devLog.ts';
import { useStorage } from '../../storage/context/useStorage.ts';
import useWebSocket from '../../websocket/useWebSocket.ts';
import { useUpload } from '../context/uploadContext/useUpload.ts';
import type { AckMessage } from '../entity/message/incoming/AckMessage.ts';
import type { ConfigMessage } from '../entity/message/incoming/ConfigMessage.ts';
import type { ErrorMessage } from '../entity/message/incoming/ErrorMessage.ts';
import type { IncomingMessage } from '../entity/message/incoming/IncomingMessage.ts';
import type { EofMessage } from '../entity/message/outgoing/EofMessage.ts';
import type { MetadataMessage } from '../entity/message/outgoing/MetadataMessage.ts';
import type { ResumeMessage } from '../entity/message/outgoing/ResumeMessage.ts';
import type { Upload } from '../entity/Upload.ts';
import type { UploadState } from '../entity/UploadState.ts';

interface useUploadSocketProps {
	url: string;
	stageMaxAttempts?: number;
	stageTimeoutMs?: number;
	stagePollIntervalMs?: number;
	doRetryOnStageFail?: boolean;
	chunkMaxAttempts?: number;
	chunkTimeoutMs?: number;
	chunkPollIntervalMs?: number;
	doRetryOnChunkFail?: boolean;
	onError?: (errorMessage: string) => void;
}

interface UploadSocketState {
	stageDatasetFile: (datasetKey: DatasetKey) => Promise<void>;
	sendDatasetFile: () => Promise<void>;
	sendChunk: (chunk: ArrayBufferLike, chunkIndex: number) => Promise<void>;
	disconnect: () => void;
}

function useUploadSocket(props: useUploadSocketProps): UploadSocketState {
	const {
		url,
		stageMaxAttempts = WEBSOCKET.STAGE.MAX_ATTEMPTS,
		stageTimeoutMs = WEBSOCKET.STAGE.TIMEOUT_MS,
		stagePollIntervalMs = WEBSOCKET.STAGE.POLL_INTERVAL_MS,
		doRetryOnStageFail = WEBSOCKET.STAGE.DO_RETRY_ON_FAIL,
		chunkMaxAttempts = WEBSOCKET.CHUNK.MAX_ATTEMPTS,
		chunkTimeoutMs = WEBSOCKET.CHUNK.TIMEOUT_MS,
		chunkPollIntervalMs = WEBSOCKET.CHUNK.POLL_INTERVAL_MS,
		doRetryOnChunkFail = WEBSOCKET.CHUNK.DO_RETRY_ON_FAIL,
		onError,
	} = props;

	const storageCtx = useStorage();
	const uploadCtx = useUpload();
	const socketCtx = useWebSocket({ url, onMessage: handleMessage });
	const datasetRef = useRef<DatasetKey | null>(null);

	async function waitForUploadConfig(datasetKey: DatasetKey, maxAttempts = doRetryOnStageFail ? stageMaxAttempts : 1) {
		// Predicates to use when waiting for upload config
		function doResolve() {
			return uploadCtx.find(datasetKey) !== null;
		}
		function doReject() {
			if (socketCtx.wsRef.current?.readyState !== WebSocket.OPEN) {
				return new Error('Socket closed');
			}
			return null;
		}

		// Wait for upload config
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (socketCtx.connectStatus === 'disconnected') {
				return;
			}

			if (attempt < maxAttempts) {
				try {
					await waitForCondition(doResolve, { timeoutMs: stageTimeoutMs, intervalMs: stagePollIntervalMs, doReject });
					return;
				} catch (ex) {
					devLog.warn(
						`Waiting for upload config failed: ${parseErrorMessage(ex)}, retrying (${attempt} / ${maxAttempts})`
					);
				}
			}
		}
		throw new Error(maxAttempts > 1 ? `Retry limit reached (${maxAttempts})` : 'Waiting for upload config failed');
	}

	async function stageDatasetFile(datasetKey: DatasetKey) {
		const upload = findActiveUpload();
		upload.info.status = 'staging';

		datasetRef.current = datasetKey;

		const storedUpload = findStoredUpload();

		// If partial upload found, remove current config and send resume to continue upload to backend
		if (storedUpload?.config !== undefined) {
			uploadCtx.remove(datasetKey);
			const resume: ResumeMessage = {
				type: 'res',
				uuid: storedUpload.config.uuid,
			};

			devLog.info('Partial upload found, sending resume message');
			try {
				await socketCtx.send(JSON.stringify(resume));
			} catch (ex) {
				upload.info.errorMessage = `Failed to send resume message: ${parseErrorMessage(ex)}`;
				upload.info.status = 'stageError';
				return;
			}
		}
		// Else, no partial upload found, send metadata to initiate new upload to backend
		else {
			const metadata: MetadataMessage = {
				type: 'meta',
				datasetKey: datasetKey,
				byteSize: upload.file.size,
				lastModified: upload.file.lastModified,
			};

			devLog.info('No partial upload found, sending metadata message');
			try {
				await socketCtx.send(JSON.stringify(metadata));
			} catch (ex) {
				upload.info.errorMessage = `Failed to send metadata message: ${parseErrorMessage(ex)}`;
				upload.info.status = 'stageError';
				return;
			}
		}

		// Wait for upload config response from backend
		try {
			await waitForUploadConfig(datasetKey);
		} catch (ex) {
			upload.info.errorMessage = `Failed to wait for incoming upload config: ${parseErrorMessage(ex)}`;
			upload.info.status = 'stageError';
			return;
		}

		upload.info.status = 'staged';
		devLog.info(`Dataset '${datasetKey}' was staged successfully`);
	}

	/**
	 * Function that sends a file via an established WebSocket to the backend to be used for populating a specified table
	 * in the database. It breaks the provided file up into ArrayBuffer chunks the size of which is defined in the config
	 * retrieved from the backend. Each chunk has a big-endian chunk index appended to it before being sent via
	 * {@link sendChunk} so that processed chunks are kept track of. Once all chunks are sent, an EOF message is sent
	 * which signals the backend to commit the data and clean up / close the connection.
	 * @pa
	 */
	async function sendDatasetFile() {
		async function processFile(upload: Upload) {
			const totalChunks = Math.ceil(upload.file.size / upload.config.chunkByteSize);

			// Process files in chunks
			for (let i = upload.config.chunkIndex; i < totalChunks; i++) {
				if (socketCtx.wsRef.current?.readyState !== WebSocket.OPEN) {
					throw new Error('WebSocket connection was closed while streaming file');
				}
				devLog.debug(`Streaming chunk [${i} / ${totalChunks - 1}]...`);

				// Start is chunk index x chunk size (from upload config)
				const start = i * upload.config.chunkByteSize;
				// End is start + chunk size (from upload config)
				const end = Math.min(start + upload.config.chunkByteSize, upload.file.size);

				// Get chunk data
				const chunk = await upload.file.slice(start, end).arrayBuffer();

				// Header to hold the chunk index (int size)
				const header = new DataView(new ArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
				// Use big-endian here
				header.setUint32(0, i, false);

				// Combine chunk index int (32-bit) into chunk data blob (8-bit) byte array
				const combined = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT + chunk.byteLength);
				combined.set(new Uint8Array(header.buffer), 0);
				combined.set(new Uint8Array(chunk), Uint32Array.BYTES_PER_ELEMENT);

				// Send the chunk
				try {
					await sendChunk(combined.buffer, i);
				} catch (ex) {
					throw new Error(`Failed to send chunk: ${parseErrorMessage(ex)}`);
				}
			}
		}

		async function waitForAllAcks(maxAttempts = doRetryOnChunkFail ? chunkMaxAttempts : 1) {
			// Predicates to use while waiting for all acks
			function doResolve() {
				return getUnackedChunkCount() === 0;
			}
			function doReject() {
				if (socketCtx.wsRef.current?.readyState !== WebSocket.OPEN) {
					return new Error('Socket closed');
				}
				return null;
			}

			// Wait for all acks
			for (let attempt = 1; attempt <= maxAttempts; attempt++) {
				// If WebSocket clean closed, stop attempts
				if (socketCtx.connectStatus === 'disconnected') {
					return;
				}

				try {
					await waitForCondition(doResolve, { timeoutMs: chunkTimeoutMs, intervalMs: chunkPollIntervalMs, doReject });
					return;
				} catch (ex) {
					devLog.warn(`Failed to wait for all acks: ${parseErrorMessage(ex)}, waiting (${attempt} / ${maxAttempts})`);
				}
			}
			throw new Error(`Retry limit reached (${maxAttempts} / ${maxAttempts})`);
		}

		async function commitUpload(upload: Upload) {
			// Send EOF once all acks received to finish stream with backend
			const eof: EofMessage = {
				type: 'eof',
				uuid: upload.config.uuid,
			};
			try {
				await socketCtx.send(JSON.stringify(eof));
			} catch (ex) {
				throw new Error(`Failed to send EOF: ${parseErrorMessage(ex)}`);
			}

			// Check if all chunks were acknowledged
			const unackedCount = getUnackedChunkCount();
			if (unackedCount > 0) {
				throw new Error(`Upload completed with ${unackedCount} chunks unacknowledged`);
			} else {
				devLog.info(`Upload completed with all chunks acknowledged`);
			}
		}

		const upload = findActiveUpload();

		try {
			upload.info.status = 'uploading';
			await processFile(upload);
		} catch (ex) {
			upload.info.status = 'uploadError';
			upload.info.errorMessage = `Failed to process upload: ${parseErrorMessage(ex)}`;
			disconnect();
			return;
		}

		try {
			await waitForAllAcks();
		} catch (ex) {
			upload.info.status = 'uploadError';
			upload.info.errorMessage = `Failed to wait for all acks: ${parseErrorMessage(ex)}`;
			disconnect();
			return;
		}

		try {
			upload.info.status = 'processing';
			await commitUpload(upload);
		} catch (ex) {
			upload.info.status = 'uploadError';
			upload.info.errorMessage = `Failed to commit upload: ${parseErrorMessage(ex)}`;
			disconnect();
			return;
		}
	}

	/**
	 * Function which sends an ArrayBuffer chunk via an established WebSocket to the backend. For added robustness, each
	 * chunk requires an ACK before the next one is sent. It sends the chunk via {@link send}, which causes this function
	 * to terminate if a rejected promise is returned. If no ACK is received after {@link chunkMaxAttempts} attempts, the
	 * function terminates. There is also a limit on in-flight chunks which is retried from backend. If the queue does not
	 * reduce before this limit is reached, the function terminates.
	 * @param chunk The chunk to send through to backend.
	 * @param chunkIndex The index of the chunk relative to total chunks in a file.
	 * @param maxAttempts
	 */
	async function sendChunk(
		chunk: ArrayBufferLike,
		chunkIndex: number,
		maxAttempts = doRetryOnChunkFail ? chunkMaxAttempts : 1
	) {
		const upload = findActiveUpload();

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (socketCtx.connectStatus === 'disconnected') {
				return;
			}

			if (getUnackedChunkCount() > upload.config.chunkInFlightMax) {
				if (attempt < maxAttempts) {
					devLog.info(`In-flight limit reached, waiting (${attempt} / ${maxAttempts})...`);
					await sleep(chunkTimeoutMs);
				}
				continue;
			}

			try {
				await socketCtx.send(chunk, 1);
				upload.info.chunkAcks[chunkIndex] = false;
				return;
			} catch (ex) {
				if (attempt < maxAttempts) {
					devLog.info(`Send failed: ${parseErrorMessage(ex)}, retrying (${attempt} / ${maxAttempts})...`);
				}
			}
		}
		throw new Error(`Max attempts reached (${maxAttempts})`);
	}

	/**
	 * Helper function which parses ChunkMetadata from JSON-string to an object.
	 * @param message A string containing {@link IncomingMessage} in JSON format.
	 */
	function parseIncomingMessage(message: string): IncomingMessage {
		let data: unknown;

		// Attempt to parse string
		try {
			data = JSON.parse(message);
		} catch (ex) {
			throw new Error(`Invalid message: ${parseErrorMessage(ex)}`);
		}

		// Validate parsed object has correct IncomingMessage properties
		if (typeof data !== 'object' || data === null || !('type' in data) || typeof data.type !== 'string') {
			throw new Error(`Invalid message: ${message}`);
		}

		return data as IncomingMessage;
	}

	/**
	 * Helper function which attempts to retrieve a mapped upload from the UploadContext, given the {@link DatasetKey}
	 * provided in props.
	 * @returns A found Upload.
	 * @throws Error if no mapped upload exists within the UploadContext.
	 */
	function findActiveUpload(): Upload {
		function assertUpload(u: Partial<Upload>): asserts u is Upload {
			if (u.file === undefined || u.config === undefined || u.info === undefined) {
				throw new Error(`Upload is incomplete`);
			}
		}

		const datasetKey = datasetRef.current;
		if (datasetKey === null) throw new Error('No upload is currently active');

		const upload = uploadCtx.find(datasetKey);
		if (upload === null) {
			throw new Error(`No upload was found in UploadContext for dataset '${datasetKey}'`);
		}

		assertUpload(upload);
		return upload;
	}

	/**
	 * Helper function which attempts to retrieve a mapped upload from the StorageContext, given the {@link DatasetKey}
	 * provided in {@link datasetRef}.
	 * @returns A found Upload.
	 * @throws Error if no mapped upload exists within the StorageContext.
	 */
	function findStoredUpload(): Partial<Upload> | null {
		const datasetKey = datasetRef.current;
		if (datasetKey === null) throw new Error('No upload is currently active');

		const uploads = storageCtx.parse(STORAGE.KEYS.PARTIAL_UPLOADS) as UploadState | null;
		if (uploads === null) return null;

		return uploads[datasetKey] ?? null;
	}

	/**
	 * Helper function which attempts to retrieve the unacked chunks count for a mapped upload in the UploadContext.
	 * @returns The unacked chunk count.
	 * @throws Error if no mapped upload exists within the UploadContext.
	 */
	function getUnackedChunkCount() {
		const upload = findActiveUpload();
		return Object.values(upload.info.chunkAcks).filter((chunk) => !chunk).length;
	}

	function handleErrorMessage(err: ErrorMessage) {
		const { code, reason } = err;

		const upload = findActiveUpload();
		const datasetKey = upload.config.datasetKey;

		let errorMessage: string;
		switch (code) {
			case UPLOAD_ERROR.NOT_FOUND: {
				const storedUploads = storageCtx.parse(STORAGE.KEYS.PARTIAL_UPLOADS) as UploadState;
				storedUploads[datasetKey] = undefined;
				storageCtx.set(STORAGE.KEYS.PARTIAL_UPLOADS, JSON.stringify(storedUploads));

				errorMessage = `Upload of dataset '${datasetKey}' could not be resumed: ${reason}`;
				devLog.info(errorMessage);
				break;
			}
			case UPLOAD_ERROR.BAD_REQUEST: {
				errorMessage = `Upload of dataset '${datasetKey}' was rejected: ${reason}`;
				devLog.error(errorMessage);
				break;
			}
			case UPLOAD_ERROR.SERVER_ERROR: {
				errorMessage = `Upload of dataset '${datasetKey}' failed to process: ${reason}'`;
				devLog.error(errorMessage);
				break;
			}
			default: {
				errorMessage = `Upload of dataset '${datasetKey}' returned unknown error code '${code}': ${reason}`;
				devLog.warn(errorMessage);
				break;
			}
		}

		upload.info.errorMessage = errorMessage;
		onError?.(errorMessage);
		disconnect();
	}

	function handleConfigMessage(cfg: ConfigMessage) {
		const upload: Partial<Upload> = {
			config: cfg,
			info: {
				chunkAcks: {},
				status: 'staged',
			},
		};
		const datasetKey = cfg.datasetKey;

		uploadCtx.add(datasetKey, upload);

		const storedUploads = (storageCtx.parse(STORAGE.KEYS.PARTIAL_UPLOADS) ?? {}) as UploadState;
		storedUploads[datasetKey] = upload;
		storageCtx.set(STORAGE.KEYS.PARTIAL_UPLOADS, JSON.stringify(storedUploads));
	}

	function handleAckMessage(ack: AckMessage) {
		const { chunkIndex } = ack;

		const upload = findActiveUpload();

		for (let i = chunkIndex - upload.config.chunkAckInterval; i < chunkIndex + upload.config.chunkAckInterval; i++) {
			upload.info.chunkAcks = { ...upload.info.chunkAcks, [i]: true };
		}
	}

	function handleEndMessage() {
		const upload = findActiveUpload();
		upload.info.status = 'completed';
	}

	/**
	 * Handler for WebSocket messages received from backend, with functionality changing based on which type of
	 * {@link IncomingMessage} is received.
	 * @param ev MessageEvent holding WebSocket message information.
	 * @throws Error if a message is received before an upload is staged.
	 * @throws Error if a {@link ConfigMessage} is received for an upload that already exists in the UploadContext.
	 * @throws Error if a message other than an Error or Config is received for an upload that does not currently exist in
	 * the UploadContext.
	 */
	function handleMessage(ev: MessageEvent<string>) {
		const upload = findActiveUpload();

		const incomingMessage = parseIncomingMessage(ev.data);
		devLog.debug(`Message received:`, incomingMessage);

		// Error message, throw Error with received reason
		if (incomingMessage.type === 'err') {
			handleErrorMessage(incomingMessage as ErrorMessage);
		}
		// Message received while upload does not exist in UploadContext
		else if (uploadCtx.find(upload.config.datasetKey) === null) {
			// Config message, update contexts
			if (incomingMessage.type === 'cfg') {
				handleConfigMessage(incomingMessage as ConfigMessage);
			}
			// Any other message type, log Error
			else {
				throw new Error('Upload config was not the first received message');
			}
		}
		// Message received while upload does exist in UploadContext
		else {
			// Ack message, acknowledge all chunks up to current index
			if (incomingMessage.type === 'ack') {
				handleAckMessage(incomingMessage as AckMessage);
			}
			// End message, backend is now processing uploaded file
			else if (incomingMessage.type === 'end') {
				handleEndMessage();
			}
			// Config already received, throw Error
			else {
				throw new Error('Upload config already received');
			}
		}
	}

	function disconnect() {
		socketCtx.disconnect();
	}

	return { stageDatasetFile, sendDatasetFile, sendChunk, disconnect };
}

export default useUploadSocket;
