import useResizeTransitionControl from './main/hooks/useResizeTransitionControl';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './main/pages/Home';
import PanelContainer from './main/components/panel/PanelContainer';
import Documents from './main/pages/Documents';
import Other from './main/pages/Other';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import ErrorDialog from './main/dialogs/ErrorDialog';
import TitlesPage from './main/pages/titles/TitlesPage';

function App() {
	useResizeTransitionControl();

	function fallbackRender({ error }: FallbackProps) {
		return <ErrorDialog error={error as Error} />;
	}

	return (
		<BrowserRouter>
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
		</BrowserRouter>
	);
}

export default App;
