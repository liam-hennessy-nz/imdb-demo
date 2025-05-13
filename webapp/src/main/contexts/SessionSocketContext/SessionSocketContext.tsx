import { createContext } from 'react';
import type { SessionSocketContextType } from './types';

export const SessionSocketContext = createContext<SessionSocketContextType | undefined>(undefined);
