export function parseErrorMessage(e: unknown) {
	if (e instanceof Error) {
		return e.message;
	} else {
		return 'Unknown error';
	}
}
