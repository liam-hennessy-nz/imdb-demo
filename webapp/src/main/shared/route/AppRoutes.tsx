import type { PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Route, Routes } from 'react-router';
import { ManageDatasetPage } from '../../dataset/ManageDatasetPage.tsx';
import { HomePage } from '../../home/HomePage.tsx';
import { parseError } from '../commonFunctions.ts';
import { ErrorDialog } from '../component/dialog/ErrorDialog.tsx';
import { Documents } from '../component/page/Documents.tsx';
import { Other } from '../component/page/Other.tsx';
import { TitlesPage } from '../component/page/titles/TitlesPage.tsx';

/**
 * Functional component which returns {@link Routes} containing all routes for the app.
 * @param children Children components to sit below the Routes.
 * @constructor
 */
export function AppRoutes({ children }: PropsWithChildren) {
	/**
	 * JSX function that will be displayed if child components fail.
	 * @param error Prop of {@link FallbackProps} that contains a caught Error.
	 */
	function fallbackRender({ error }: FallbackProps) {
		return <ErrorDialog error={parseError(error)} />;
	}

	return (
		<Routes>
			<Route path="/" element={<ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>}>
				<Route index element={<HomePage />} />
				<Route path="titles" element={<TitlesPage />} />
				<Route path="names" element={<div></div>} />
				<Route path="documents" element={<Documents />} />
				<Route path="other" element={<Other />} />
				<Route path="datasets" element={<ManageDatasetPage />} />
			</Route>
		</Routes>
	);
}
