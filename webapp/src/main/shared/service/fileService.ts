export function readFileSnippet(
	file: File,
	resolve: (headers: string[]) => void,
	reject: (reason: unknown) => void,
	start?: number,
	end?: number
) {
	const reader = new FileReader();

	reader.onerror = () => {
		reject(reader.error);
	};

	reader.onload = () => {
		const text = reader.result as string;

		const firstLine = text.split(/\r?\n/)[0];
		const headers = firstLine.split('\t');
		resolve(headers);
	};

	reader.readAsText(file.slice(start ?? 0, end ?? file.size));
}
