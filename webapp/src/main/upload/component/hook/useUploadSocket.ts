import { useRef } from 'react';
import { parseErrorMessage, sleep, waitForCondition } from '../../../shared/commonFunctions.ts';
import { API } from '../../../shared/constant/api.ts';
import { STORAGE, WEBSOCKET } from '../../../shared/constant/constants.ts';
import { UPLOAD_ERROR } from '../../../shared/constant/uploadError.ts';
import type { DatasetKey } from '../../../shared/entity/Datasets.ts';
import { devLog } from '../../../shared/util/devLog.ts';
import { useStorage } from '../../../storage/context/StorageContext.ts';
import { useWebSocket } from '../../../websocket/useWebSocket.ts';
import type { AckMessage } from '../../entity/message/incoming/AckMessage.ts';
import type { ConfigMessage } from '../../entity/message/incoming/ConfigMessage.ts';
import type { ErrorMessage } from '../../entity/message/incoming/ErrorMessage.ts';
import type { IncomingMessage } from '../../entity/message/incoming/IncomingMessage.ts';
import type { EofMessage } from '../../entity/message/outgoing/EofMessage.ts';
import type { MetadataMessage } from '../../entity/message/outgoing/MetadataMessage.ts';
import type { ResumeMessage } from '../../entity/message/outgoing/ResumeMessage.ts';
import type { Upload } from '../../entity/Upload.ts';
import type { UploadRecord } from '../../entity/UploadRecord.ts';
import { assertUploadHasConfig, assertUploadIsNotNull, doesUploadFilesMatch } from '../../service/UploadHelper.ts';
import { useUpload } from '../context/uploadContext/UploadContext.ts';

interface useUploadSocketProps {
	datasetKey: DatasetKey;
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

export function useUploadSocket(props: useUploadSocketProps): UploadSocketState {
	const {
		datasetKey,
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
	const ws = useWebSocket({ url: API.WEBSOCKET_UPLOAD_URL, onMessage: handleMessage });

	const selectedFile = useRef<File | null>(null);

	async function waitForUploadConfig(maxAttempts = doRetryOnStageFail ? stageMaxAttempts : 1) {
		// Predicates to use when waiting for upload config
		function doResolve() {
			return uploadCtx.find(datasetKey) !== null;
		}
		function doReject() {
			if (ws.wsRef.current?.readyState !== WebSocket.OPEN) {
				return new Error('Socket closed');
			}
			return null;
		}

		// Wait for upload config
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (ws.connectStatus === 'disconnected') {
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

	async function stageDatasetFile() {
		const upload = uploadCtx.find(datasetKey);
		assertUploadIsNotNull(upload);

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'staging' });

		// Attempt to find partial upload in StorageContext
		const storedUpload = (storageCtx.find(STORAGE.KEYS.DATASET_UPLOADS) as UploadRecord | null)?.[datasetKey];
		// Clear stored upload (will be re-added when up-to-date config is received from backend)
		uploadCtx.dispatch({ type: 'UPLOAD_REMOVED', datasetKey: datasetKey });

		// If partial upload with config was found and selected file matches stored file...
		if (storedUpload?.config !== undefined && doesUploadFilesMatch(storedUpload, upload)) {
			devLog.info('Partial upload found, sending resume message...');
			const resume: ResumeMessage = {
				type: 'res',
				uuid: storedUpload.config.uuid,
				fileName: upload.file.name,
				byteSize: upload.file.size,
				lastModified: upload.file.lastModified,
			};
			await ws.send(JSON.stringify(resume));
		}
		// Else (no partial upload with config found or selected file does not match stored file)...
		else {
			devLog.info('No partial upload found, sending metadata message...');
			const metadata: MetadataMessage = {
				type: 'meta',
				datasetKey: datasetKey,
				fileName: upload.file.name,
				byteSize: upload.file.size,
				lastModified: upload.file.lastModified,
			};
			await ws.send(JSON.stringify(metadata));
		}

		// Wait for upload config response from backend
		await waitForUploadConfig();

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'staged' });
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
		async function processFile(upload: Upload & { config: ConfigMessage }, file: File) {
			const totalChunks = Math.ceil(upload.file.size / upload.config.chunkByteSize);

			// Process files in chunks
			for (let i = upload.config.chunkIndex; i < totalChunks; i++) {
				if (ws.wsRef.current?.readyState !== WebSocket.OPEN) {
					throw new Error('WebSocket connection was closed while streaming file');
				}
				devLog.debug(`Streaming chunk [${i} / ${totalChunks - 1}]...`);

				// Start is chunk index x chunk size (from upload config)
				const start = i * upload.config.chunkByteSize;
				// End is start + chunk size (from upload config)
				const end = Math.min(start + upload.config.chunkByteSize, upload.file.size);

				// Get chunk data
				const chunk = await file.slice(start, end).arrayBuffer();

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
				if (ws.wsRef.current?.readyState !== WebSocket.OPEN) {
					return new Error('Socket closed');
				}
				return null;
			}

			// Wait for all acks
			for (let attempt = 1; attempt <= maxAttempts; attempt++) {
				// If WebSocket clean closed, stop attempts
				if (ws.connectStatus === 'disconnected') {
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

		async function commitUpload(upload: Upload & { config: ConfigMessage }) {
			// Send EOF once all acks received to finish stream with backend
			const eof: EofMessage = {
				type: 'eof',
				uuid: upload.config.uuid,
			};
			try {
				await ws.send(JSON.stringify(eof));
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

		if (selectedFile.current === null) {
			uploadCtx.dispatch({
				type: 'ERROR_OCCURRED',
				datasetKey: datasetKey,
				errorMessage: 'No file selected',
				status: 'uploadError',
			});
			return;
		}

		const upload = uploadCtx.find(datasetKey);
		try {
			assertUploadHasConfig(upload);
		} catch (ex) {
			uploadCtx.dispatch({
				type: 'ERROR_OCCURRED',
				datasetKey: datasetKey,
				errorMessage: `Failed to begin commiting upload: ${parseErrorMessage(ex)}`,
				status: 'uploadError',
			});
			return;
		}

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'uploading' });

		try {
			await processFile(upload, selectedFile.current);
		} catch (ex) {
			uploadCtx.dispatch({
				type: 'ERROR_OCCURRED',
				datasetKey: datasetKey,
				errorMessage: `Failed to process upload: ${parseErrorMessage(ex)}`,
				status: 'uploadError',
			});
			disconnect();
			return;
		}

		try {
			await waitForAllAcks();
		} catch (ex) {
			uploadCtx.dispatch({
				type: 'ERROR_OCCURRED',
				datasetKey: datasetKey,
				errorMessage: `Failed to wait for all acks: ${parseErrorMessage(ex)}`,
				status: 'uploadError',
			});
			disconnect();
			return;
		}

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'processing' });

		try {
			await commitUpload(upload);
		} catch (ex) {
			uploadCtx.dispatch({
				type: 'ERROR_OCCURRED',
				datasetKey: datasetKey,
				errorMessage: `Failed to commit upload: ${parseErrorMessage(ex)}`,
				status: 'uploadError',
			});
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
		const upload = uploadCtx.find(datasetKey);
		try {
			assertUploadHasConfig(upload);
		} catch (ex) {
			uploadCtx.dispatch({
				type: 'ERROR_OCCURRED',
				datasetKey: datasetKey,
				errorMessage: `Failed to send chunk: ${parseErrorMessage(ex)}`,
				status: 'uploadError',
			});
			return;
		}

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (ws.connectStatus === 'disconnected') {
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
				await ws.send(chunk, 1);
				uploadCtx.dispatch({ type: 'CHUNK_SENT', datasetKey: datasetKey, chunk: chunkIndex });
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
	 * Helper function which attempts to retrieve the unacked chunks count for a mapped upload in the UploadContext.
	 * @returns The unacked chunk count. Will always be 0 if no upload is found.
	 */
	function getUnackedChunkCount() {
		const upload = uploadCtx.find(datasetKey);
		if (upload === null) return 0;

		return Object.values(upload.info.chunkAcks).filter((chunk) => !chunk).length;
	}

	function handleErrorMessage(err: ErrorMessage) {
		const { code, reason } = err;

		const upload = uploadCtx.find(datasetKey);
		assertUploadHasConfig(upload);

		let errorMessage: string;
		switch (code) {
			case UPLOAD_ERROR.NOT_FOUND: {
				uploadCtx.dispatch({ type: 'UPLOAD_REMOVED', datasetKey: datasetKey });

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

		uploadCtx.dispatch({
			type: 'ERROR_OCCURRED',
			datasetKey: datasetKey,
			errorMessage: errorMessage,
			status: 'uploadError',
		});
		onError?.(errorMessage);
		disconnect();
	}

	function handleConfigMessage(cfg: ConfigMessage) {
		const upload = uploadCtx.find(datasetKey);
		assertUploadHasConfig(upload);

		uploadCtx.dispatch({ type: 'CONFIG_UPDATED', datasetKey: datasetKey, config: cfg });
	}

	function handleAckMessage(ack: AckMessage) {
		const { chunkIndex } = ack;

		const upload = uploadCtx.find(datasetKey);
		assertUploadHasConfig(upload);

		for (let i = chunkIndex - upload.config.chunkAckInterval; i < chunkIndex + upload.config.chunkAckInterval; i++) {
			uploadCtx.dispatch({ type: 'CHUNK_ACKED', datasetKey: datasetKey, chunk: i });
		}
	}

	function handleEndMessage() {
		const upload = uploadCtx.find(datasetKey);
		assertUploadHasConfig(upload);

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'completed' });
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
		const incomingMessage = parseIncomingMessage(ev.data);
		devLog.debug(`Message received:`, incomingMessage);

		// Error message, throw Error with received reason
		if (incomingMessage.type === 'err') {
			handleErrorMessage(incomingMessage as ErrorMessage);
		}
		// Message received while upload does not exist in UploadContext
		else if (uploadCtx.find(datasetKey) === null) {
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
		ws.disconnect();
	}

	return { stageDatasetFile, sendDatasetFile, sendChunk, disconnect };
}
