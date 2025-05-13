import type { PropsWithChildren } from 'react';

function TopPanel({ children }: PropsWithChildren) {
	return <div className="top-panel w-full">{children}</div>;
}

export default TopPanel;
