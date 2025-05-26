import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/viva-dark/theme.css';
import './main.css';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import { AppProvider } from './main/components/contexts/AppContext';
import { SessionSocketProvider } from './main/components/contexts/SessionSocketContext';
import { BrowserRouter } from 'react-router';
import { StorageProvider } from './main/components/contexts/StorageContext';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find root element');

createRoot(rootElement).render(
	<StrictMode>
		<PrimeReactProvider>
			<BrowserRouter>
				<StorageProvider>
					<SessionSocketProvider>
						<AppProvider>
							<App />
						</AppProvider>
					</SessionSocketProvider>
				</StorageProvider>
			</BrowserRouter>
		</PrimeReactProvider>
	</StrictMode>
);
