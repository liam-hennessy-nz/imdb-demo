import { parseErrorMessage } from '../../shared/commonFunctions.ts';
import { DATASET_SNIPPET_SIZE_BYTES } from '../../shared/constant/constants.ts';
import { DATASET_SCHEMA, type DatasetKey } from '../../shared/entity/Datasets.ts';
import { readFileSnippet } from '../../shared/service/fileService.ts';

/**
 * Function that attempts to parse a given File for a DatasetName.
 * @param file The file to parse.
 * @returns Resolved {@link DatasetKey} promise, if the file is a valid IMDb dataset.
 * @throws Error if a snippet fails to read from the file.
 * @throws Error if the file is not a valid IMDb dataset.
 */
export async function parseDatasetKey(file: File): Promise<DatasetKey> {
	let headers: string[] = [];
	try {
		headers = await new Promise<string[]>((resolve, reject) => {
			readFileSnippet(file, resolve, reject, 0, DATASET_SNIPPET_SIZE_BYTES);
		});
	} catch (ex) {
		throw new Error(`Failed to read first ${DATASET_SNIPPET_SIZE_BYTES} bytes: ${parseErrorMessage(ex)}`);
	}

	const datasetKey = findDatasetKey(headers);
	if (datasetKey === null) {
		throw new Error(`Columns do not match any IMDb dataset: '${headers.join()}'`);
	}

	return datasetKey;
}

/**
 * Function that attempts to find a DatasetName given an array of strings.
 * @param columnArray An array of column header strings.
 * @returns {@link DatasetKey}, if every string in the string array exists in a dataset’s column headers. Order is
 * disregarded.
 * @returns `null`, if the string array does not match any datasets.
 */
function findDatasetKey(columnArray: string[]): DatasetKey | null {
	for (const dataset of Object.keys(DATASET_SCHEMA) as DatasetKey[]) {
		const { column } = DATASET_SCHEMA[dataset];
		const columnKeys = Object.keys(column);

		if (columnArray.length === columnKeys.length && columnKeys.every((k) => columnArray.includes(k))) {
			return dataset;
		}
	}

	return null;
}
