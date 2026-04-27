import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router';
import { parseErrorMessage } from '../../shared/util/commonFunctions.ts';
import { devLog } from '../../shared/util/devLog.ts';
import { StorageContext } from './StorageContext.ts';

export interface StorageContextState {
	find: (key: string, options?: StorageFindProps) => unknown;
	set: (key: string, value: string, options?: StorageSetProps) => void;
	remove: (key: string, options?: StorageRemoveProps) => void;
}

export interface StorageFindProps {
	/** Whether to delete a SearchParam if one exists with a specified key. (default: `false`) */
	doDeleteSearchParam?: boolean;
	/** Only does something if `doPreferSearchParam` is `true`. Whether to update LocalStorage with the found
	 * SearchParam value. (default: `true`) */
	doUpdateLocalStorage?: boolean;
	/** Whether to prefer a SearchParam if one exists with a specified key. If `doUpdateLocalStorage` is `true`, update
	 * LocalStorage with the found SearchParam value. (default: `false`) */
	doPreferSearchParam?: boolean;
}

export interface StorageSetProps {
	/** Whether to update a SearchParam if one exists with a specified key. (default: `false`) */
	doUpdateSearchParam?: boolean;
	/** Whether to prefer a SearchParam if one exists with a specified key. If `doUpdateSearchParam` is `true`, the found
	 * SearchParam will be deleted. (default: `false`) */
	doPreferSearchParam?: boolean;
}

export interface StorageRemoveProps {
	/** Whether to delete a SearchParam if one exists with a specified key. (default: `false`) */
	doDeleteSearchParam?: boolean;
}

const defaultFindProps: StorageFindProps = { doDeleteSearchParam: false, doPreferSearchParam: true };
const defaultSetProps: StorageSetProps = { doUpdateSearchParam: false, doPreferSearchParam: false };
const defaultRemoveProps: StorageRemoveProps = { doDeleteSearchParam: false };

export function StorageProvider({ children }: PropsWithChildren) {
	const [searchParams, setSearchParams] = useSearchParams();

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
				if (options.doDeleteSearchParam) {
					setSearchParams(
						(prev) => {
							prev.delete(key);
							return prev;
						},
						{ replace: true }
					);
				}
				// Update LocalStorage with retrieved value if requested
				if (options.doPreferSearchParam) {
					localStorage.setItem(key, searchParamsValue);
				}
				return searchParamsValue;
			}
			// Second, attempt to parse value from LocalStorage
			const localStorageValue = localStorage.getItem(key);
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
		(key: string, value: string, options: StorageSetProps = defaultSetProps) => {
			// If prefer SearchParams requested...
			if (options.doPreferSearchParam) {
				const searchParamsValue = searchParams.get(key);
				// If value in SearchParams exists, update LocalStorage with it
				if (searchParamsValue !== null) {
					localStorage.setItem(key, searchParamsValue);
					// If update SearchParams requested, delete value from SearchParams
					if (options.doUpdateSearchParam) {
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
				if (options.doUpdateSearchParam && searchParams.get(key) !== value) {
					setSearchParams(
						(prev) => {
							prev.set(key, value);
							return prev;
						},
						{ replace: true }
					);
				}
			}
		},
		[searchParams, setSearchParams]
	);

	const remove = useCallback(
		(key: string, options: StorageRemoveProps = defaultRemoveProps) => {
			localStorage.removeItem(key);
			// If update SearchParams requested, delete value from SearchParams
			if (options.doDeleteSearchParam) {
				setSearchParams(
					(prev) => {
						prev.delete(key);
						return prev;
					},
					{ replace: true }
				);
			}
		},
		[setSearchParams]
	);

	const value: StorageContextState = useMemo(() => {
		return { find, set, remove };
	}, [find, set, remove]);

	return <StorageContext value={value}>{children}</StorageContext>;
}
