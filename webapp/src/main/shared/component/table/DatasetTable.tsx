import Paper from '@mui/material/Paper';
import {
	DataGrid,
	type GridColDef,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { DATASET_CONFIGS, type DatasetKey, type DatasetMap } from '../../../dataset/entity/Datasets.ts';
import { PAGINATOR } from '../../constant/constants.ts';
import type { PageRequestDTO } from '../../dto/PageRequestDTO.ts';
import type { PageResponseDTO } from '../../dto/PageResponseDTO.ts';
import { devLog } from '../../util/devLog.ts';

interface DataTableProps<K extends DatasetKey> {
	datasetKey: K;
	initPage: PageResponseDTO<DatasetMap[K]>;
	onPage: (request: PageRequestDTO) => Promise<PageResponseDTO<DatasetMap[K]>>;
}

export function DatasetTable<K extends DatasetKey>(props: DataTableProps<K>) {
	const { datasetKey, initPage, onPage } = props;

	const [data, setData] = useState<DatasetMap[K][]>(initPage.content);
	const [rowCount, setRowCount] = useState<number>(initPage.page.totalElements);
	const [loading, setLoading] = useState<boolean>(false);

	const [pagination, setPagination] = useState<GridPaginationModel>(PAGINATOR.INIT.PAGINATION);
	const [sort, setSort] = useState<GridSortModel>(PAGINATOR.INIT.SORT);
	const [filter, setFilter] = useState<GridFilterModel>(PAGINATOR.INIT.FILTER);

	async function requestPage(request: PageRequestDTO) {
		setLoading(true);

		const response = await onPage(request);
		setData(response.content);
		setRowCount(response.page.totalElements);

		setLoading(false);
	}

	async function handlePageChange(newPage: GridPaginationModel) {
		setPagination(newPage);
		devLog.debug(`Pagination changed to ${JSON.stringify(newPage)}`);

		const request: PageRequestDTO = { pagination: newPage, sort, filter };
		await requestPage(request);
	}

	async function handleSortChange(newSort: GridSortModel) {
		setSort(newSort);
		devLog.debug(`Page sort changed to ${JSON.stringify(newSort)}`);

		const request: PageRequestDTO = { pagination, sort: newSort, filter };
		await requestPage(request);
	}

	async function handleFilterChange(newFilter: GridFilterModel) {
		setFilter(newFilter);
		devLog.debug(`Filter changed to ${JSON.stringify(newFilter)}`);

		const request: PageRequestDTO = { pagination, sort, filter: newFilter };
		await requestPage(request);
	}

	function getColumns(): GridColDef[] {
		const datasetConfig = DATASET_CONFIGS[datasetKey];

		return Object.entries(datasetConfig.keys).map(([key, value]) => ({
			field: key,
			headerName: value.label,
			flex: value.flex,
		}));
	}

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				width: 'calc(100vw - 30px)',
				height: 'calc(100vh - 100px)',
			}}
		>
			<DataGrid
				columns={getColumns()}
				rows={data}
				rowCount={rowCount}
				loading={loading}
				density="compact"
				pagination
				pageSizeOptions={PAGINATOR.PAGE_SIZE_OPTIONS}
				paginationModel={pagination}
				sortModel={sort}
				filterModel={filter}
				paginationMode="server"
				sortingMode="server"
				filterMode="server"
				onPaginationModelChange={(newPage) => void handlePageChange(newPage)}
				onSortModelChange={(newSort) => void handleSortChange(newSort)}
				onFilterModelChange={(newFilter) => void handleFilterChange(newFilter)}
				sx={{ minHeight: 250 }}
			/>
		</Paper>
	);
}
