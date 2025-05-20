import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/viva-dark/theme.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import { AppProvider } from './main/contexts/AppContext';
import { SessionSocketProvider } from './main/contexts/SessionSocketContext';
import { BrowserRouter } from 'react-router';
import { StorageProvider } from './main/contexts/StorageContext';

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<SessionSocketProvider>
				<PrimeReactProvider>
					<BrowserRouter>
						<StorageProvider>
							<AppProvider>
								<App />
							</AppProvider>
						</StorageProvider>
					</BrowserRouter>
				</PrimeReactProvider>
			</SessionSocketProvider>
		</StrictMode>
	);
} else {
	throw new Error('Failed to find root element');
}
