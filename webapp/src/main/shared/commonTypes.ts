export interface PromiseHandlers<T = void> {
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: unknown) => void;
}
