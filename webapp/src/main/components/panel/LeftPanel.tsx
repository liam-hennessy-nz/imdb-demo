import type { PropsWithChildren } from 'react';
import { useApp } from '../contexts/AppContext';

function LeftPanel({ children }: PropsWithChildren) {
	const { isSidebarVisible } = useApp();

	return (
		<div
			className="left-panel flex overflow-hidden"
			style={{
				width: isSidebarVisible ? '15rem' : 0,
				transition: 'width 0.5s ease',
				textWrap: 'nowrap',
			}}
		>
			{children}
		</div>
	);
}

export default LeftPanel;
