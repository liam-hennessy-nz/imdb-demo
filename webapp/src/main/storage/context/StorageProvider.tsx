import type { PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router';
import { parseErrorMessage } from '../../shared/commonFunctions.ts';
import { devLog } from '../../shared/util/devLog.ts';
import { StorageContext, type StorageContextType } from './StorageContext.ts';

export interface StorageOptionProps {
	/** Whether to clear a SearchParam if one exists with specified key. (default: `false`) */
	doClearSearchParam?: boolean;
	/** Whether to update LocalStorage if a SearchParam exists with specified key. (default: `true`) */
	doOverwriteStorage?: boolean;
}

export function StorageProvider({ children }: PropsWithChildren) {
	const [searchParams, setSearchParams] = useSearchParams();

	/**
	 * Function attempts to fetch the value pair for a specified key from URL SearchParams first, then from LocalStorage.
	 * @return If found, the value. Otherwise, `null`.
	 */
	function find(key: string, options: StorageOptionProps = { doClearSearchParam: false, doOverwriteStorage: true }) {
		const searchParamsValue = searchParams.get(key);
		if (searchParamsValue !== null) {
			if (options.doClearSearchParam) {
				searchParams.delete(key);
				setSearchParams(searchParams);
			}
			if (options.doOverwriteStorage) {
				window.localStorage.setItem(key, searchParamsValue);
			}
			return searchParamsValue;
		}

		const localStorageValue = window.localStorage.getItem(key);
		if (localStorageValue !== null) return localStorageValue;

		return null;
	}

	/**
	 * Function updates a storage key with a specified value. If the value is `null`, the key is instead deleted.
	 * @param key The key to search by.
	 * @param value The new value.
	 * @param doUpdateUrl Whether to update URL SearchParams. (default: `false`)
	 */
	function set(key: string, value: string | null, doUpdateUrl = false) {
		const localStorage = window.localStorage;

		if (value !== null) {
			// If value specified, update local storage
			localStorage.setItem(key, value);
			if (doUpdateUrl && searchParams.get(key) !== value) {
				// If update url requested and value different from current, update search params
				searchParams.set(key, value);
				setSearchParams(searchParams);
			}
		} else {
			// If null specified as value, remove item from local storage
			localStorage.removeItem(key);
			if (doUpdateUrl) {
				// If update url requested, remove item from search params
				searchParams.delete(key);
				setSearchParams(searchParams);
			}
		}
	}

	function parse(
		key: string,
		options: StorageOptionProps = { doClearSearchParam: false, doOverwriteStorage: true }
	): unknown {
		const value = find(key, options);

		try {
			if (value !== null) {
				return JSON.parse(value);
			} else {
				return null;
			}
		} catch (ex) {
			devLog.error(`Failed to parse JSON from LocalStorage: ${parseErrorMessage(ex)}`);
		}
	}

	const value: StorageContextType = { find, set, parse };

	return <StorageContext value={value}>{children}</StorageContext>;
}
