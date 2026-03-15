import { ChevronDownIcon, ChevronUpIcon } from '@primereact/icons';
import { Button } from '@primereact/ui/button';
import { UploadPopover } from '../../../upload/component/popover/UploadPopover.tsx';
import { useApp } from '../../context/AppContext/AppContext.ts';

export function Banner() {
	const { isDarkModeEnabled, setDarkModeEnabled } = useApp();

	function handleDarkModeClick() {
		setDarkModeEnabled(!isDarkModeEnabled);
	}

	return (
		<div className="flex flex-1 justify-center items-center h-full px-0 py-4 relative bg-surface-500">
			<h3>IMDb Demo</h3>
			<div className="flex flex-1 absolute right-4 gap-2">
				<Button className="w-8 h-8" onClick={handleDarkModeClick}>
					{isDarkModeEnabled ? <ChevronUpIcon /> : <ChevronDownIcon />}
				</Button>
				<UploadPopover />
			</div>
		</div>
	);
}
