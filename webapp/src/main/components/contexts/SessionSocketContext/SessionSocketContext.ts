import { createContext } from 'react';
import type { SessionSocketContextType } from './types.ts';

export const SessionSocketContext = createContext<SessionSocketContextType | undefined>(undefined);
