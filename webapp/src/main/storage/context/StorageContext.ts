import { createContext } from 'react';
import type { StorageOptionProps } from './StorageProvider.tsx';

export interface StorageContextType {
	find: (key: string, options?: StorageOptionProps) => string | null;
	set: (key: string, value: string | null, doUpdateUrl?: boolean) => void;
	parse: (key: string, options?: StorageOptionProps) => unknown;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);
