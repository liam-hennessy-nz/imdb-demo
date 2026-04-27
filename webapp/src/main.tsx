import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App.tsx';
import { AppProvider } from './main/app/context/AppProvider.tsx';
import { AppRoutes } from './main/app/route/AppRoutes.tsx';
import { AppTheme } from './main/app/theme/AppTheme.tsx';
import { StorageProvider } from './main/storage/context/StorageProvider.tsx';
import { UploadProvider } from './main/upload/context/UploadProvider.tsx';

const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Failed to find root element');

createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<StorageProvider>
				<UploadProvider>
					<AppProvider>
						<AppTheme>
							<AppRoutes>
								<App />
							</AppRoutes>
						</AppTheme>
					</AppProvider>
				</UploadProvider>
			</StorageProvider>
		</BrowserRouter>
	</StrictMode>
);
