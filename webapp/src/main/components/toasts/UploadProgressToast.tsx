import { type ContentProps, Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';
import { ProgressBar } from 'primereact/progressbar';

interface UploadProgressToastProps {
	visible: boolean;
	progress: number;
}

function UploadProgressToast({ visible, progress }: UploadProgressToastProps) {
	const toastRef = useRef<Toast | null>(null);

	useEffect(() => {
		if (visible) {
			toastRef.current?.show({
				severity: 'success',
				summary: 'Uploading',
				detail: 'Uploading files...',
				life: 3000,
			});
		} else {
			toastRef.current?.clear();
		}
	}, [visible]);

	function template(props: ContentProps) {
		return (
			<div className="flex flex-column bg-black-alpha-90" style={{ borderRadius: '10px' }}>
				<div className="flex p-3 gap-3">
					<i className="pi pi-cloud-upload text-2xl"></i>
					<span className="p-toast-message m-0">{props.message.detail}</span>
				</div>
				<div className="flex flex-column p-3 gap-3">
					<ProgressBar value={progress} showValue={false} />
				</div>
			</div>
		);
	}

	return <Toast ref={toastRef} content={template} />;
}

export default UploadProgressToast;
