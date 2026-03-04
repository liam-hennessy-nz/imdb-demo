import { Button } from '@primereact/ui/button';
import { useStorage } from '../../../storage/context/StorageContext.ts';

function Documents() {
	const storage = useStorage();

	return (
		<div>
			<Button
				onClick={() => {
					storage.set('test', 'test');
				}}
			/>
		</div>
	);
}

export default Documents;
