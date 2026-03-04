import { useCallback, useMemo, useRef, type PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router';
import { parseErrorMessage } from '../../shared/commonFunctions.ts';
import { devLog } from '../../shared/util/devLog.ts';
import { StorageContext } from './StorageContext.ts';

export interface StorageContextType {
	find: (key: string, options?: StorageFindProps) => unknown;
	set: (key: string, value: string | null, options?: StorageSetProps) => void;
}

export interface StorageFindProps {
	/** Whether to clear a SearchParam if one exists with a specified key. (default: `false`) */
	doConsumeSearchParam?: boolean;
	/** Whether to update LocalStorage if a SearchParam exists with a specified key. (default: `true`) */
	doUpdateStorage?: boolean;
}

export interface StorageSetProps {
	/** Whether to update SearchParams if one exists with a specified key. (default: `false`) */
	doUpdateSearchParams?: boolean;
	/** Whether to prefer a SearchParam if one exists with a specified key. If `doUpdateSearchParams` is `true`, the found
	 * SearchParam will be deleted. (default: `false`) */
	doPreferSearchParam?: boolean;
}

const defaultFindProps: StorageFindProps = { doConsumeSearchParam: false, doUpdateStorage: true };
const defaultSetProps: StorageSetProps = { doUpdateSearchParams: false, doPreferSearchParam: false };

export function StorageProvider({ children }: PropsWithChildren) {
	const [searchParams, setSearchParams] = useSearchParams();

	const isInitialised = useRef<boolean>(false);

	/**
	 * Function attempts to get the value pair of a specified key from URL SearchParams first, then from LocalStorage.
	 * @return A `string` if a SearchParam is found, `null` if no value is found, otherwise an `unknown`.
	 */
	const find = useCallback(
		(key: string, options: StorageFindProps = defaultFindProps) => {
			// First, attempt to get value from SearchParams
			const searchParamsValue = searchParams.get(key);
			if (searchParamsValue !== null) {
				// Remove item from SearchParams if requested
				if (options.doConsumeSearchParam) {
					setSearchParams(
						(prev) => {
							prev.delete(key);
							return prev;
						},
						{ replace: true }
					);
				}
				// Update LocalStorage with retrieved value if requested
				if (options.doUpdateStorage) {
					window.localStorage.setItem(key, searchParamsValue);
				}
				return searchParamsValue;
			}
			// Second, attempt to parse value from LocalStorage
			const localStorageValue = window.localStorage.getItem(key);
			if (localStorageValue !== null) {
				try {
					return JSON.parse(localStorageValue) as unknown;
				} catch (ex) {
					devLog.error(`Failed to parse JSON from LocalStorage: ${parseErrorMessage(ex)}`);
				}
			}
			// Otherwise, return null
			return null;
		},
		[searchParams, setSearchParams]
	);

	/**
	 * Function updates a storage key with a specified value. If the value is `null`, the key is instead deleted.
	 * @param key The key to search by.
	 * @param value The new value.
	 * @param doUpdateUrl Whether to update URL SearchParams. (default: `false`)
	 */
	const set = useCallback(
		(key: string, value: string | null, options: StorageSetProps = defaultSetProps) => {
			const localStorage = window.localStorage;

			// If value specified, update LocalStorage
			if (value !== null) {
				// If prefer SearchParams requested...
				if (options.doPreferSearchParam) {
					const searchParamsValue = searchParams.get(key);
					// If value in SearchParams exists, update LocalStorage with it
					if (searchParamsValue !== null) {
						localStorage.setItem(key, searchParamsValue);
						// If update SearchParams requested, delete value from SearchParams
						if (options.doUpdateSearchParams) {
							setSearchParams(
								(prev) => {
									prev.delete(key);
									return prev;
								},
								{ replace: true }
							);
						}
					} else {
						localStorage.setItem(key, value);
					}
				} else {
					localStorage.setItem(key, value);
					// If update SearchParams requested, update value in SearchParams
					if (options.doUpdateSearchParams && searchParams.get(key) !== value) {
						setSearchParams(
							(prev) => {
								prev.set(key, value);
								return prev;
							},
							{ replace: true }
						);
					}
				}
			}
			// Else (null), remove item from local storage
			else {
				localStorage.removeItem(key);
				// If update SearchParams requested, delete value from SearchParams
				if (options.doUpdateSearchParams) {
					setSearchParams((prev) => {
						prev.delete(key);
						return prev;
					});
				}
			}
		},
		[searchParams, setSearchParams]
	);

	const value: StorageContextType = useMemo(() => {
		return { find, set, isInitialised };
	}, [find, set]);

	return <StorageContext value={value}>{children}</StorageContext>;
}
