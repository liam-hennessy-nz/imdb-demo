import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

interface ErrorDialogProps {
	error: Error;
}

function ErrorDialog({ error }: ErrorDialogProps) {
	const [visible, setVisible] = useState<boolean>(true);

	return (
		<Dialog
			visible={visible}
			onHide={() => {
				setVisible(false);
			}}
			dismissableMask
			header="Something went wrong! (ಠ_ಠ)"
			footer="See console for more info"
		>
			<div role="alert">
				<pre className="p-3" style={{ backgroundColor: 'black', color: 'red', borderRadius: '10px' }}>
					{error.stack}
				</pre>
			</div>
		</Dialog>
	);
}

export default ErrorDialog;
