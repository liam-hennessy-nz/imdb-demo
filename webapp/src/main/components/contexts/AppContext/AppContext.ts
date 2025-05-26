import { createContext } from 'react';
import type { AppContextType } from './types.ts';

export const AppContext = createContext<AppContextType | undefined>(undefined);
