import type { DatasetKey } from '../../dataset/entity/Datasets.ts';
import { STORAGE, WEBSOCKET } from '../../shared/constant/constants.ts';
import { ENDPOINT } from '../../shared/constant/endpoint.ts';
import { UPLOAD_ERROR } from '../../shared/constant/uploadError.ts';
import { newErrorWrap, parseErrorMessage, sleep, waitForCondition } from '../../shared/util/commonFunctions.ts';
import { devLog } from '../../shared/util/devLog.ts';
import { initWebSocket } from '../../shared/util/initWebSocket.ts';
import type { StorageContextState } from '../../storage/context/StorageProvider.tsx';
import type { UploadContextState } from '../context/UploadProvider.tsx';
import type { AckMessage } from '../entity/message/incoming/AckMessage.ts';
import type { ConfigMessage } from '../entity/message/incoming/ConfigMessage.ts';
import type { ErrorMessage } from '../entity/message/incoming/ErrorMessage.ts';
import type { EofMessage } from '../entity/message/outgoing/EofMessage.ts';
import type { MetadataMessage } from '../entity/message/outgoing/MetadataMessage.ts';
import type { ResumeMessage } from '../entity/message/outgoing/ResumeMessage.ts';
import type { Upload } from '../entity/Upload.ts';
import type { StoredUploadRecord } from '../entity/UploadRecord.ts';
import {
	assertUploadHasConfig,
	assertUploadHasFile,
	buildChunkByteArray,
	doesUploadMatchStored,
	parseIncomingMessage,
} from './uploadHelper.ts';

interface Callbacks {
	onError?: (msg: string) => void;
}

interface UploadDatasetProps {
	uploadCtx: UploadContextState;
	storageCtx: StorageContextState;
	datasetKey: DatasetKey;
	validateMaxAttempts?: number;
	validateTimeoutMs?: number;
	validatePollIntervalMs?: number;
	doRetryOnValidateFail?: boolean;
	chunkMaxAttempts?: number;
	chunkTimeoutMs?: number;
	chunkPollIntervalMs?: number;
	doRetryOnChunkFail?: boolean;
	callbacks?: Callbacks;
}

interface UploadDatasetState {
	upload: () => Promise<void>;
	pause: () => void;
	resume: () => void;
	cancel: () => void;
	retry: () => Promise<void>;
}

export function uploadService(props: UploadDatasetProps): UploadDatasetState {
	const {
		uploadCtx,
		storageCtx,
		datasetKey,
		validateMaxAttempts = WEBSOCKET.VALIDATE.MAX_ATTEMPTS,
		validateTimeoutMs = WEBSOCKET.VALIDATE.TIMEOUT_MS,
		doRetryOnValidateFail = WEBSOCKET.VALIDATE.DO_RETRY_ON_FAIL,
		chunkMaxAttempts = WEBSOCKET.CHUNK.MAX_ATTEMPTS,
		chunkTimeoutMs = WEBSOCKET.CHUNK.TIMEOUT_MS,
		doRetryOnChunkFail = WEBSOCKET.CHUNK.DO_RETRY_ON_FAIL,
		callbacks,
	} = props;

	const url = new URL(`${ENDPOINT.WEBSOCKET}/upload`);
	const ws = initWebSocket({ url, callbacks: { onMessage: handleMessage } });

	async function waitForUploadConfig(maxAttempts = doRetryOnValidateFail ? validateMaxAttempts : 1) {
		// Predicates to use when waiting for upload config
		function doResolve() {
			// Resolve if WebSocket connection closed cleanly or config received
			return ws.getConnectStatus() === 'closed' || uploadCtx.find(datasetKey)?.config !== undefined;
		}
		function doReject() {
			if (ws.getConnectStatus() !== 'open') {
				return new Error('Socket closed');
			}
			return null;
		}

		// Wait for upload config
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (ws.getConnectStatus() === 'closed') {
				return;
			}

			if (attempt < maxAttempts) {
				try {
					await waitForCondition(doResolve, { timeoutMs: validateTimeoutMs, doReject });
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

	async function validateDatasetFile() {
		const upload = uploadCtx.find(datasetKey);
		assertUploadHasFile(upload);

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'verifying' });

		// Attempt to find partial upload in StorageContext
		const storedUpload = (storageCtx.find(STORAGE.KEYS.DATASET_UPLOADS) as StoredUploadRecord)?.[datasetKey];
		// Clear existing config from context, will wait for fresh config from backend
		uploadCtx.dispatch({ type: 'CONFIG_REMOVED', datasetKey: datasetKey });

		// If upload has a config and a matching stored upload is found...
		if (storedUpload?.config !== undefined && doesUploadMatchStored(upload, storedUpload)) {
			// Send resume message
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
		// Else (upload does not have a config or no matching stored upload is found)...
		else {
			// Send metadata message
			devLog.info('No matching partial upload found, sending metadata message...');
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

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'verified' });
		devLog.info(`Dataset '${datasetKey}' was verified successfully`);
	}

	async function sendChunk(
		upload: Upload & { config: ConfigMessage },
		chunk: ArrayBufferLike,
		chunkIndex: number,
		maxAttempts = doRetryOnChunkFail ? chunkMaxAttempts : 1
	) {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (ws.getConnectStatus() === 'closed') {
				return;
			}

			if (uploadCtx.getUploadChunkUnackedCount(datasetKey) > upload.config.chunkInFlightMax) {
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

	async function processFile() {
		const upload = uploadCtx.find(datasetKey);
		assertUploadHasFile(upload);
		assertUploadHasConfig(upload);

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'uploading' });

		const totalChunks = Math.ceil(upload.file.size / upload.config.chunkByteSize);

		// Process files in chunks
		for (let i = upload.config.chunkIndex; i < totalChunks; i++) {
			while (uploadCtx.find(datasetKey)?.status === 'paused') {
				await sleep(50);
			}
			if (uploadCtx.find(datasetKey)?.status === 'cancelled') return;

			if (ws.getConnectStatus() !== 'open') {
				throw new Error('WebSocket connection was interrupted while streaming file');
			}
			devLog.debug(`Streaming chunk [${i} / ${totalChunks - 1}]...`);

			// Build chunk byte array
			const chunkByteArray = await buildChunkByteArray(upload, i);

			// Send the chunk
			try {
				await sendChunk(upload, chunkByteArray.buffer, i);
			} catch (ex) {
				throw newErrorWrap(`Failed to send chunk`, ex);
			}
		}
	}

	async function waitForAllAcks(maxAttempts = doRetryOnChunkFail ? chunkMaxAttempts : 1) {
		// Predicates to use while waiting for all acks
		function doResolve() {
			// Resolve if WebSocket connection closed cleanly or all chunks acknowledged
			return ws.getConnectStatus() === 'closed' || uploadCtx.getUploadChunkUnackedCount(datasetKey) === 0;
		}
		function doReject() {
			if (ws.getConnectStatus() !== 'open') {
				return new Error('Socket connection interrupted');
			}
			return null;
		}

		// Wait for all acks
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			// If WebSocket clean closed, stop attempts
			if (ws.getConnectStatus() === 'closed') {
				return;
			}

			try {
				await waitForCondition(doResolve, { timeoutMs: chunkTimeoutMs, doReject });
				return;
			} catch (ex) {
				devLog.warn(`Failed to wait for all acks: ${parseErrorMessage(ex)}, waiting (${attempt} / ${maxAttempts})`);
			}
		}
		throw new Error(`Retry limit reached (${maxAttempts} / ${maxAttempts})`);
	}

	async function commitUpload() {
		const upload = uploadCtx.find(datasetKey);
		assertUploadHasFile(upload);
		assertUploadHasConfig(upload);

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'processing' });

		// Send EOF once all acks received to finish stream with backend
		const eof: EofMessage = {
			type: 'eof',
			uuid: upload.config.uuid,
		};
		try {
			await ws.send(JSON.stringify(eof));
		} catch (ex) {
			throw newErrorWrap(`Failed to send EOF`, ex);
		}

		// Check if all chunks were acknowledged
		const unackedCount = uploadCtx.getUploadChunkUnackedCount(datasetKey);
		if (unackedCount > 0) {
			throw new Error(`Upload completed with ${unackedCount} chunks unacknowledged`);
		} else {
			devLog.info(`Upload completed with all chunks acknowledged`);
		}
	}

	async function upload() {
		try {
			await validateDatasetFile();
		} catch (ex) {
			handleUploadError(`Failed to validate dataset file: ${parseErrorMessage(ex)}`);
		}

		try {
			await processFile();
			// If upload was cancelled, close WebSocket connection
			if (uploadCtx.find(datasetKey)?.status === 'cancelled') {
				ws.close();
				uploadCtx.dispatch({ type: 'UPLOAD_REMOVED', datasetKey });
				return;
			}
			await waitForAllAcks();
		} catch (ex) {
			handleUploadError(`Failed to process dataset file: ${parseErrorMessage(ex)}`);
		}

		// Prompt backend to start importing dataset
		try {
			await commitUpload();
		} catch (ex) {
			handleUploadError(`Failed to commit dataset upload: ${parseErrorMessage(ex)}`);
			return;
		}
	}

	function pause() {
		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'paused' });
	}

	function resume() {
		const upload = uploadCtx.find(datasetKey);
		try {
			assertUploadHasFile(upload);
			assertUploadHasConfig(upload);
		} catch (ex) {
			handleUploadError(`Cannot resume upload as required data is missing: ${parseErrorMessage(ex)}`);
			return;
		}

		if (uploadCtx.find(datasetKey)?.status === 'paused') {
			uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey, status: 'uploading' });
		}
	}

	function cancel() {
		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey, status: 'cancelled' });
	}

	async function retry() {
		// TODO: perhaps this logic should be moved out so that open file dialog can be triggered
		//       or just drop functionality altogether
	}

	function handleUploadError(errorMessage: string) {
		uploadCtx.dispatch({
			type: 'ERROR_OCCURRED',
			datasetKey: datasetKey,
			errorMessage: errorMessage,
			status: 'uploadError',
		});
	}

	function handleErrorMessage(err: ErrorMessage) {
		const { code, reason } = err;

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
		callbacks?.onError?.(errorMessage);
		close();
	}

	function handleConfigMessage(cfg: ConfigMessage) {
		uploadCtx.dispatch({ type: 'CONFIG_UPDATED', datasetKey: datasetKey, config: cfg });
	}

	function handleAckMessage(ack: AckMessage) {
		const { chunkIndex } = ack;

		const upload = uploadCtx.find(datasetKey);
		assertUploadHasConfig(upload);
		assertUploadHasFile(upload);

		const intervalMin = Math.max(chunkIndex - upload.config.chunkAckInterval, 0);
		const intervalMax = Math.min(
			chunkIndex + upload.config.chunkAckInterval,
			uploadCtx.getUploadChunkTotalCount(datasetKey)
		);

		for (let i = intervalMin; i < intervalMax; i++) {
			uploadCtx.dispatch({ type: 'CHUNK_ACKED', datasetKey: datasetKey, chunk: i });
		}
	}

	function handleEndMessage() {
		const upload = uploadCtx.find(datasetKey);
		assertUploadHasConfig(upload);

		uploadCtx.dispatch({ type: 'STATUS_UPDATED', datasetKey: datasetKey, status: 'completed' });
	}

	function handleMessage(ev: MessageEvent<string>) {
		const incomingMessage = parseIncomingMessage(ev.data);
		devLog.debug(`Message received:`, incomingMessage);

		if (incomingMessage.type === 'err') {
			// Error message, throw Error with received reason
			handleErrorMessage(incomingMessage as ErrorMessage);
		} else if (incomingMessage.type === 'cfg') {
			// Config message, update upload context
			handleConfigMessage(incomingMessage as ConfigMessage);
		} else if (uploadCtx.find(datasetKey) === null) {
			// Ack or end received while upload does not exist in UploadContext, throw Error
			throw new Error('Upload config was not the first received message');
		} else {
			// Ack message, acknowledge all chunks up to current index
			if (incomingMessage.type === 'ack') {
				handleAckMessage(incomingMessage as AckMessage);
			}
			// End message, backend is now processing uploaded file
			else {
				handleEndMessage();
			}
		}
	}

	return { upload, pause, resume, cancel, retry };
}
