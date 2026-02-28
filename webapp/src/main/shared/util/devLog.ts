type LogFn = (...args: unknown[]) => void;

interface DevLogger {
	info: LogFn;
	warn: LogFn;
	error: LogFn;
	debug: LogFn;
}

const noop = () => {
	/* empty */
};

/**
 * A wrapper for {@link console} which only outputs while the webapp is in DEV mode.
 */
export const devLog: DevLogger = import.meta.env.DEV
	? {
			// eslint-disable-next-line no-console
			info: console.info.bind(console),
			// eslint-disable-next-line no-console
			warn: console.warn.bind(console),
			// eslint-disable-next-line no-console
			error: console.error.bind(console),
			// eslint-disable-next-line no-console
			debug: console.debug.bind(console),
		}
	: {
			info: noop,
			warn: noop,
			error: noop,
			debug: noop,
		};
