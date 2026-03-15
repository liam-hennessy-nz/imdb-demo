import { Dialog } from '@primereact/ui/dialog';

interface ErrorDialogProps {
	error: Error;
}

export function ErrorDialog({ error }: ErrorDialogProps) {
	return (
		<div className="flex justify-center">
			<Dialog.Root defaultOpen modal dismissableMask>
				<Dialog.Portal>
					<Dialog.Header>
						<Dialog.Title>Something went wrong! (ಠ_ಠ)</Dialog.Title>
						<Dialog.HeaderActions>
							<Dialog.Close />
						</Dialog.HeaderActions>
					</Dialog.Header>
					<Dialog.Content>
						<pre role="alert" className="p-4 rounded-2xl bg-black text-red-600">
							{error.stack ?? 'ಥ╭╮ಥ'}
						</pre>
					</Dialog.Content>
					<Dialog.Footer>See console for more info</Dialog.Footer>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}
