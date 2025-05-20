import { createContext } from 'react';
import type { StorageContextType } from './types.ts';

export const StorageContext = createContext<StorageContextType | undefined>(undefined);
