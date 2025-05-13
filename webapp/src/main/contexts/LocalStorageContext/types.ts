export interface LocalStorageContextType {
	get: <T>(key: string) => Promise<T | null>;
	set: (key: string, value: string) => void;
}
