import type { PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Route, Routes } from 'react-router';
import { DatasetPage } from '../../dataset/DatasetPage.tsx';
import { HomePage } from '../../home/HomePage.tsx';
import { ErrorDialog } from '../../shared/component/dialog/ErrorDialog.tsx';
import { parseError } from '../../shared/util/commonFunctions.ts';

/**
 * Functional component which returns {@link Routes} containing all routes for the app.
 * @param children Children components to sit below the Routes.
 * @constructor
 */
export function AppRoutes({ children }: PropsWithChildren) {
	function fallbackRender({ error }: FallbackProps) {
		return <ErrorDialog error={parseError(error)} />;
	}

	return (
		<Routes>
			<Route path="/" element={<ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>}>
				<Route index element={<HomePage />} />
				<Route path="datasets" element={<DatasetPage />} />
			</Route>
		</Routes>
	);
}
