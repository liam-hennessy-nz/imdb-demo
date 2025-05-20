import useResizeTransitionControl from './main/hooks/useResizeTransitionControl';
import { Route, Routes } from 'react-router';
import Home from './main/components/pages/Home';
import PanelContainer from './main/components/panel/PanelContainer';
import Documents from './main/components/pages/Documents';
import Other from './main/components/pages/Other';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import ErrorDialog from './main/components/dialogs/ErrorDialog';
import TitlesPage from './main/components/pages/titles/TitlesPage';

function App() {
	useResizeTransitionControl();

	function fallbackRender({ error }: FallbackProps) {
		return <ErrorDialog error={error as Error} />;
	}

	return (
		<Routes>
			<Route
				path="/"
				element={
					<ErrorBoundary fallbackRender={fallbackRender}>
						<PanelContainer />
					</ErrorBoundary>
				}
			>
				<Route index element={<Home />} />
				<Route path="titles" element={<TitlesPage />} />
				<Route path="documents" element={<Documents />} />
				<Route path="other" element={<Other />} />
			</Route>
		</Routes>
	);
}

export default App;
