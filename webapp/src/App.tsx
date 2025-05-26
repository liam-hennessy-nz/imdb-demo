import useResizeTransitionControl from './main/hooks/useResizeTransitionControl.ts';
import PanelContainer from './main/components/panel/PanelContainer';
import AppRoutes from './main/components/routes/AppRoutes.tsx';

function App() {
	useResizeTransitionControl();

	return (
		<AppRoutes>
			<PanelContainer />
		</AppRoutes>
	);
}

export default App;
