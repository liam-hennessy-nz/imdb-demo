import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router';
import { parseErrorMessage } from '../../shared/util/commonFunctions.ts';
import { devLog } from '../../shared/util/devLog.ts';
import type { FindType, StorageMapKey } from '../type/storageTypes.ts';
import { StorageContext } from './StorageContext.ts';

export interface StorageContextState {
	find: <K extends StorageMapKey, T extends boolean = false>(key: K, options?: StorageFindProps<T>) => FindType<K, T>;
	set: (key: string, value: string, options?: StorageSetProps) => void;
	remove: (key: string, options?: StorageRemoveProps) => void;
}

export interface StorageFindProps<T extends boolean = false> {
	doDeleteSearchParam?: boolean;
	doUpdateLocalStorage?: boolean;
	doPreferSearchParam?: T;
}

export interface StorageSetProps {
	doUpdateSearchParam?: boolean;
	doPreferSearchParam?: boolean;
}

export interface StorageRemoveProps {
	doDeleteSearchParam?: boolean;
}

const defaultFindProps: StorageFindProps = { doDeleteSearchParam: false, doUpdateLocalStorage: true };
const defaultSetProps: StorageSetProps = { doUpdateSearchParam: false, doPreferSearchParam: false };
const defaultRemoveProps: StorageRemoveProps = { doDeleteSearchParam: false };

export function StorageProvider({ children }: PropsWithChildren) {
	const [searchParams, setSearchParams] = useSearchParams();

	/**
	 * Function attempts to get a value paired to the specified key from storage. It uses two generic types. The first is
	 * the primary return type, which is inferred by the storage key prop. The second is whether the return type includes
	 * `string`, which will occur if the option `doPreferSearchParam` is `true` as a value may be retrieved from the
	 * search params.
	 * @param key The storage key to find.
	 * @param options Options for the find operation.
	 * @param options.doDeleteSearchParam Whether to delete a SearchParam if one exists with a specified key. (default:
	 * `false`).
	 * @param options.doUpdateLocalStorage Only does something if `doPreferSearchParam` is `true`. Whether to update
	 * LocalStorage with the found SearchParam value. (default: `true`).
	 * @param options.doPreferSearchParam Whether to prefer a SearchParam if one exists with a specified key. If
	 * `doUpdateLocalStorage` is `true`, update LocalStorage with the found SearchParam value as well. (default: `false`).
	 * @return A `string` if a SearchParam is found, `null` if no value is found, otherwise an `unknown`.
	 */
	const find = useCallback(
		<K extends StorageMapKey, T extends boolean = false>(
			key: K,
			options: StorageFindProps<T> = defaultFindProps as StorageFindProps<T>
		): FindType<K, T> => {
			// If requested, attempt to get value from SearchParams first
			if (options.doPreferSearchParam) {
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
					if (options.doUpdateLocalStorage) {
						localStorage.setItem(key, searchParamsValue);
					}
					return searchParamsValue as FindType<K, T>;
				}
			}

			// Attempt to parse value from LocalStorage
			const localStorageValue = localStorage.getItem(key);
			if (localStorageValue !== null) {
				try {
					return JSON.parse(localStorageValue) as FindType<K, T>;
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
	 * @param options Options for the set operation.
	 * @param options.doUpdateSearchParam Whether to update a SearchParam if one exists with a specified key. (default:
	 * `false`).
	 * @param options.doPreferSearchParam Whether to prefer a SearchParam if one exists with a specified key. If
	 * `doUpdateSearchParam` is `true`, the found SearchParam will be deleted as well. (default: `false`).
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

	/**
	 * Function removes an item with a given storage key from storage.
	 * @param key The key to search by.
	 * @param options Options for the remove operation.
	 * @param options.doDeleteSearchParam Whether to delete a SearchParam if one exists with a specified key. (default:
	 * `false`).
	 */
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
