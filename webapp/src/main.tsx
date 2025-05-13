import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/viva-dark/theme.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import { LocalStorageProvider } from './main/contexts/LocalStorageContext';
import { AppProvider } from './main/contexts/AppContext';
import { SessionSocketProvider } from './main/contexts/SessionSocketContext';

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<PrimeReactProvider>
				<SessionSocketProvider>
					<LocalStorageProvider>
						<AppProvider>
							<App />
						</AppProvider>
					</LocalStorageProvider>
				</SessionSocketProvider>
			</PrimeReactProvider>
		</StrictMode>
	);
} else {
	throw new Error('Failed to find root element');
}
