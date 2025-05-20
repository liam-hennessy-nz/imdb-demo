import { useStorage } from '../../contexts/StorageContext';
import { Button } from 'primereact/button';

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
