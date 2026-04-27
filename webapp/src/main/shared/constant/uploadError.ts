type UploadError = Partial<Record<string, number>>;

export const UPLOAD_ERROR = {
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
} as const satisfies UploadError;
