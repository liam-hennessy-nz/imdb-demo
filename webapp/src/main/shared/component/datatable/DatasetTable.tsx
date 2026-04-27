import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState, type ChangeEvent } from 'react';
import { labelsFor, type DatasetKey, type TypeFromDatasetKey } from '../../../dataset/entity/Datasets.ts';
import type { FilterRequest, FilterType, SortType } from '../../entity/FilterRequest.ts';
import type { PageResponse } from '../../entity/PageResponse.ts';
import { devLog } from '../../util/devLog.ts';

interface DataTableProps<K extends DatasetKey> {
	datasetKey: K;
	initPage: PageResponse<TypeFromDatasetKey<K>>;
	emptyMessage?: string;
	onPage: (request: FilterRequest) => Promise<PageResponse<TypeFromDatasetKey<K>>>;
}

export function DatasetTable<K extends DatasetKey>(props: DataTableProps<K>) {
	const { datasetKey, initPage, emptyMessage = 'No data to display.', onPage } = props;

	const [data, setData] = useState<TypeFromDatasetKey<K>[]>(initPage.content);

	const [number, setNumber] = useState<number>(initPage.page.number);
	const [size, setSize] = useState<number>(initPage.page.size);
	const [totalElements, setTotalElements] = useState<number>(initPage.page.totalElements);

	const [sort, setSort] = useState<SortType>({ ['id']: 1 });
	const [filter, setFilter] = useState<FilterType>({});

	const headers = labelsFor(datasetKey);

	async function requestPage(request: FilterRequest) {
		const response = await onPage(request);

		setData(response.content);
		setTotalElements(response.page.totalElements);
	}

	async function handlePageChange(newNumber: number) {
		if (newNumber === number) return;

		setNumber(newNumber);
		devLog.debug(`Page number changed to ${newNumber}`);

		const request: FilterRequest = {
			number: newNumber,
			size,
			sort,
			filter,
		};

		await requestPage(request);
	}

	async function handleRowsPerPageChange(ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
		const newSize = parseInt(ev.target.value, 10);
		if (newSize === size || Number.isNaN(newSize)) return;

		setSize(newSize);
		devLog.debug(`Page size changed to ${newSize}`);

		const request: FilterRequest = {
			number,
			size: newSize,
			sort,
			filter,
		};

		await requestPage(request);
	}

	function headTemplate() {
		return (
			<TableRow>
				{headers.map((label, labelIndex) => {
					const key = `${datasetKey}-table-head-${labelIndex}`;
					return <TableCell key={key}>{label}</TableCell>;
				})}
			</TableRow>
		);
	}

	function bodyTemplate() {
		return data.map((row, rowIndex) => {
			const rowKey = `${datasetKey}-table-row-${rowIndex}`;
			return (
				<TableRow key={rowKey}>
					{Object.values(row).map((cell, cellIndex) => {
						const cellKey = `${rowKey}-cell-${cellIndex}`;
						return <TableCell key={cellKey}>{String(cell)}</TableCell>;
					})}
				</TableRow>
			);
		});
	}

	function emptyBodyTemplate() {
		return (
			<TableRow>
				<TableCell colSpan={headers.length}>{emptyMessage}</TableCell>
			</TableRow>
		);
	}

	return (
		<Paper sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
			<TableContainer sx={{ maxHeight: 'calc(100vh - 150px)' }}>
				<Table>
					<TableHead>{headTemplate()}</TableHead>

					<TableBody>{data.length > 0 ? bodyTemplate() : emptyBodyTemplate()}</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				count={totalElements}
				page={number}
				onPageChange={(_, page) => void handlePageChange(page)}
				rowsPerPage={size}
				rowsPerPageOptions={[5, 10, 25]}
				onRowsPerPageChange={(ev) => void handleRowsPerPageChange(ev)}
				sx={{ flex: 1 }}
			/>
		</Paper>
	);
}
