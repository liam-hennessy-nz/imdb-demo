/**
 * Function parses an unknown object into an Error message string.
 * @param e The unknown object.
 * @return If the object is an Error: the Error message. Else: 'Unknown error'.
 */
export function parseErrorMessage(e: unknown) {
	if (e instanceof Error) {
		return e.message;
	} else {
		return 'Unknown error';
	}
}

/**
 * Function parses an unknown object into an Error.
 * @param e The unknown object.
 * @return If the object is an Error: the Error. Else: A new Error with message 'Unknown error'.
 */
export function parseError(e: unknown) {
	if (e instanceof Error) {
		return e;
	} else {
		return new Error('Unknown error');
	}
}
