type UploadError = Partial<Record<string, number>>;

export const UPLOAD_ERROR: UploadError = {
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
} as const satisfies UploadError;
