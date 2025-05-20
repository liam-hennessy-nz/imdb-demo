export interface StorageContextType {
	get: (key: string) => string | null;
	set: (key: string, value: string | null, updateUrl?: boolean) => void;
	parseLocalStorage: (key: string) => unknown;
}
