import type { PropsWithChildren } from 'react';
import { Route, Routes } from 'react-router';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Home from '../pages/Home.tsx';
import TitlesPage from '../pages/titles/TitlesPage.tsx';
import Documents from '../pages/Documents.tsx';
import Other from '../pages/Other.tsx';
import ErrorDialog from '../dialogs/ErrorDialog.tsx';
import { parseError } from '../../common/CommonFunctions.ts';
import NamesMain from '../pages/names/NamesMain.tsx';

/**
 * Functional component which returns {@link Routes} containing all routes for the app.
 * @param children Children components to sit below the Routes.
 * @constructor
 */
function AppRoutes({ children }: PropsWithChildren) {
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
				<Route index element={<Home />} />
				<Route path="titles" element={<TitlesPage />} />
				<Route path="names" element={<NamesMain />} />
				<Route path="documents" element={<Documents />} />
				<Route path="other" element={<Other />} />
			</Route>
		</Routes>
	);
}

export default AppRoutes;
