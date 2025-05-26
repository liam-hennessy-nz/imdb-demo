import { useApp } from '../contexts/AppContext';
import { Button } from 'primereact/button';

function PanelToggleButton() {
	const { isSidebarVisible, handleToggleSidebarVisible } = useApp();

	return (
		<Button
			className="mb-auto absolute"
			icon="pi pi-angle-double-left"
			title="toggle sidebar"
			onClick={handleToggleSidebarVisible}
			style={{
				width: '2rem',
				height: '2rem',
				left: isSidebarVisible ? 'calc(13rem - 2px)' : 'calc(-2rem - 2px)',
				top: '6rem',
				transition: 'left 0.5s ease, transform 0.5s 0.2s ease',
				transform: isSidebarVisible ? 'rotateY(0deg)' : 'rotateY(180deg)',
				transformOrigin: 'right center',
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
				zIndex: 1000,
			}}
		/>
	);
}

export default PanelToggleButton;
