import { createContext } from 'react';
import type { LocalStorageContextType } from './types';

export const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);
