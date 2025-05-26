import type { PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router';
import { parseErrorMessage } from '../../../common/CommonFunctions.ts';
import type { StorageContextType } from './types.ts';
import { StorageContext } from './StorageContext.ts';

export function StorageProvider({ children }: PropsWithChildren) {
	const [searchParams, setSearchParams] = useSearchParams();

	/**
	 * Function attempts to fetch the value pair for a specified key from URL searchParams (prioritised) and localStorage
	 * @param key The key to search by
	 * @return The `string` value if found, otherwise `null`
	 */
	function get(key: string) {
		const searchParamsValue = searchParams.get(key);
		if (searchParamsValue) return searchParamsValue;

		const localStorageValue = window.localStorage.getItem(key);
		if (localStorageValue) return localStorageValue;

		return null;
	}

	/**
	 * Function updates a storage key with a specified value. If the value is `null`, the key is instead deleted.
	 * @param key The key to search by
	 * @param value The new value
	 * @param updateUrl Whether to update URL searchParams (default: `false`)
	 */
	function set(key: string, value: string | null, updateUrl = false) {
		const localStorage = window.localStorage;
		if (value) {
			localStorage.setItem(key, value);
		} else {
			localStorage.removeItem(key);
		}

		// If update to URL is requested
		if (updateUrl) {
			// If value is not null
			if (value) {
				// If searchParams does not already have this key value pair
				if (searchParams.get(key) !== value) {
					// Update searchParams
					searchParams.set(key, value);
					setSearchParams(searchParams);
				}
			} else {
				// Else if value is null, delete key from searchParams
				searchParams.delete(key);
			}
		}
	}

	function parseLocalStorage(key: string): unknown {
		const localStorageValue = window.localStorage.getItem(key);

		try {
			if (localStorageValue) {
				return JSON.parse(localStorageValue);
			} else {
				return null;
			}
		} catch (e) {
			console.debug(parseErrorMessage(e));
		}
	}

	const value: StorageContextType = { get, set, parseLocalStorage };

	return <StorageContext value={value}>{children}</StorageContext>;
}
