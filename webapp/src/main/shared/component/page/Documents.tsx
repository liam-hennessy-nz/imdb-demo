import { Button } from '@primereact/ui/button';
import { useStorage } from '../../../storage/context/useStorage.ts';

function Documents() {
	const storage = useStorage();

	return (
		<div>
			<Button
				onClick={() => {
					storage.set('test', 'test', true);
				}}
			/>
		</div>
	);
}

export default Documents;
