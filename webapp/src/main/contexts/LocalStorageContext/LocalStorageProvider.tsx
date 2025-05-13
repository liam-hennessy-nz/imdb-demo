import { type PropsWithChildren, useCallback, useMemo } from 'react';
import { LocalStorageContext } from './LocalStorageContext';
import { parseErrorMessage } from '../../common/CommonFunctions.ts';
import type { LocalStorageContextType } from './types.ts';

export function LocalStorageProvider({ children }: PropsWithChildren) {
	const localStorage = window.localStorage;

	const get = useCallback(
		<T,>(key: string): Promise<T | null> => {
			return new Promise((resolve, reject) => {
				const value = localStorage.getItem(key);

				if (value && value !== 'undefined') {
					try {
						const parsedValue = JSON.parse(value) as T;
						resolve(parsedValue);
					} catch (e: unknown) {
						reject(new Error(`Failed to parse localStorage for "${key}": ${parseErrorMessage(e)}`));
					}
				} else {
					resolve(null);
				}
			});
		},
		[localStorage]
	);

	const set = useCallback(
		(key: string, value: unknown) => {
			if (value && value !== 'undefined') {
				localStorage.setItem(key, JSON.stringify(value));
			} else {
				localStorage.removeItem(key);
			}
		},
		[localStorage]
	);

	const value: LocalStorageContextType = useMemo(
		() => ({
			get,
			set,
		}),
		[get, set]
	);

	return <LocalStorageContext value={value}>{children}</LocalStorageContext>;
}
