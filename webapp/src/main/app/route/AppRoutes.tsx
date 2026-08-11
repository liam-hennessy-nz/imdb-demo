import type { PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Route, Routes } from 'react-router';
import { AliasPage } from '../../alias/component/AliasPage.tsx';
import { CharacterPage } from '../../character/component/CharacterPage.tsx';
import { DatasetPage } from '../../dataset/component/DatasetPage.tsx';
import { GenrePage } from '../../genre/component/GenrePage.tsx';
import { HomePage } from '../../home/component/HomePage.tsx';
import { PersonPage } from '../../person/component/PersonPage.tsx';
import { ProfessionPage } from '../../profession/component/ProfessionPage.tsx';
import { RawNameBasicPage } from '../../raw/namebasic/component/RawNameBasicPage.tsx';
import { RawTitleAkaPage } from '../../raw/titleaka/component/RawTitleAkaPage.tsx';
import { RawTitleBasicPage } from '../../raw/titlebasic/component/RawTitleBasicPage.tsx';
import { RawTitleEpisodePage } from '../../raw/titleepisode/component/RawTitleEpisodePage.tsx';
import { RawTitlePrincipalPage } from '../../raw/titleprincipal/component/RawTitlePrincipalPage.tsx';
import { RawTitleRatingPage } from '../../raw/titlerating/component/RawTitleRatingPage.tsx';
import { ErrorDialog } from '../../shared/component/dialog/ErrorDialog.tsx';
import { parseError } from '../../shared/util/commonFunctions.ts';
import { TitlePage } from '../../title/component/TitlePage.tsx';

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
				<Route path="alias" element={<AliasPage />} />
				<Route path="character" element={<CharacterPage />} />
				<Route path="genre" element={<GenrePage />} />
				<Route path="person" element={<PersonPage />} />
				<Route path="profession" element={<ProfessionPage />} />
				<Route path="title" element={<TitlePage />} />
				<Route path="dataset" element={<DatasetPage />} />
				<Route path="raw">
					<Route path="name_basic" element={<RawNameBasicPage />} />
					<Route path="title_aka" element={<RawTitleAkaPage />} />
					<Route path="title_basic" element={<RawTitleBasicPage />} />
					<Route path="title_episode" element={<RawTitleEpisodePage />} />
					<Route path="title_principal" element={<RawTitlePrincipalPage />} />
					<Route path="title_rating" element={<RawTitleRatingPage />} />
				</Route>
			</Route>
		</Routes>
	);
}
