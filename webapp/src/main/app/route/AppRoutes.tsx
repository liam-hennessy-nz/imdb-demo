import type { PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Route, Routes } from 'react-router';
import { DatasetPage } from '../../dataset/component/DatasetPage.tsx';
import { HomePage } from '../../home/component/HomePage.tsx';
import { RawNameBasicPage } from '../../raw/namebasic/component/RawNameBasicPage.tsx';
import { RawTitleAkaPage } from '../../raw/titleaka/component/RawTitleAkaPage.tsx';
import { RawTitleBasicPage } from '../../raw/titlebasic/component/RawTitleBasicPage.tsx';
import { RawTitleCrewPage } from '../../raw/titlecrew/component/RawTitleCrewPage.tsx';
import { RawTitleEpisodePage } from '../../raw/titleepisode/component/RawTitleEpisodePage.tsx';
import { RawTitlePrincipalPage } from '../../raw/titleprincipal/component/RawTitlePrincipalPage.tsx';
import { RawTitleRatingPage } from '../../raw/titlerating/component/RawTitleRatingPage.tsx';
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
				<Route path="/raw/name_basic" element={<RawNameBasicPage />} />
				<Route path="/raw/title_aka" element={<RawTitleAkaPage />} />
				<Route path="/raw/title_basic" element={<RawTitleBasicPage />} />
				<Route path="/raw/title_crew" element={<RawTitleCrewPage />} />
				<Route path="/raw/title_episode" element={<RawTitleEpisodePage />} />
				<Route path="/raw/title_principal" element={<RawTitlePrincipalPage />} />
				<Route path="/raw/title_rating" element={<RawTitleRatingPage />} />
				<Route path="datasets" element={<DatasetPage />} />
			</Route>
		</Routes>
	);
}
