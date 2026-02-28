import './main.css';
import { PrimeReactProvider } from '@primereact/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { AppProvider } from './main/shared/context/AppContext/AppProvider.tsx';
import { StorageProvider } from './main/storage/context/StorageProvider.tsx';
import { UploadProvider } from './main/upload/context/uploadContext/UploadProvider.tsx';
import { auraCustomBlue } from './theme/auraCustomBlue.ts';

const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Failed to find root element');

createRoot(rootElement).render(
	<StrictMode>
		<PrimeReactProvider theme={auraCustomBlue}>
			<BrowserRouter>
				<StorageProvider>
					<UploadProvider>
						<AppProvider>
							<App />
						</AppProvider>
					</UploadProvider>
				</StorageProvider>
			</BrowserRouter>
		</PrimeReactProvider>
	</StrictMode>
);
