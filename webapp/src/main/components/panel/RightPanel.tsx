import type { PropsWithChildren } from 'react';
import { useApp } from '../contexts/AppContext';

function RightPanel({ children }: PropsWithChildren) {
	const { isSidebarVisible } = useApp();

	return (
		<div
			className="right-panel flex overflow-hidden"
			style={{
				width: isSidebarVisible ? 'calc(100vw - 15rem)' : '100vw',
				transition: 'width 0.5s ease',
			}}
		>
			{children}
		</div>
	);
}

export default RightPanel;
