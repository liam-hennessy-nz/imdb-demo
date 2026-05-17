import Paper from '@mui/material/Paper';
import {
	DataGrid,
	type GridColDef,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { DATASET_CONFIGS, type DatasetKey, type DatasetMap } from '../../../dataset/entity/Datasets.ts';
import { useNotifyContext } from '../../../notify/context/NotifyContext.ts';
import { PAGINATOR } from '../../constant/constants.ts';
import type { PageRequest } from '../../dto/PageRequest.ts';
import type { PageResponseDTO } from '../../dto/PageResponseDTO.ts';
import { isAbortError, parseErrorMessage } from '../../util/commonFunctions.ts';
import { devLog } from '../../util/devLog.ts';

interface DataTableProps<K extends DatasetKey> {
	datasetKey: K;
	onPage: (request: PageRequest, abortSignal?: AbortSignal) => Promise<PageResponseDTO<DatasetMap[K]>>;
}

export function DatasetTable<K extends DatasetKey>(props: DataTableProps<K>) {
	const { datasetKey, onPage } = props;

	const notifyCtx = useNotifyContext();

	const [data, setData] = useState<DatasetMap[K][]>([]);
	const [rowCount, setRowCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [pagination, setPagination] = useState<GridPaginationModel>(PAGINATOR.INIT.PAGINATION);
	const [sort, setSort] = useState<GridSortModel>(PAGINATOR.INIT.SORT);
	const [filter, setFilter] = useState<GridFilterModel>(PAGINATOR.INIT.FILTER);

	async function requestPage(request: PageRequest) {
		const controller = new AbortController();

		setIsLoading(true);
		try {
			const response = await onPage(request, controller.signal);
			setData(response.content);
			setRowCount(response.page.totalElements);
		} catch (ex) {
			if (isAbortError(ex)) return;
			notifyCtx.showSnackbar(`Failed to fetch data: ${parseErrorMessage(ex)}`, 'error');
		}
		setIsLoading(false);
	}

	function getKeys(): GridColDef[] {
		const datasetConfig = DATASET_CONFIGS[datasetKey];

		return Object.entries(datasetConfig.keys).map(([key, value]) => ({
			field: key,
			headerName: value.label,
			type: value.type,
			flex: value.flex,
			editable: value.editable,
		}));
	}

	useEffect(() => {
		const controller = new AbortController();

		async function initFetch() {
			const initRequest: PageRequest = {
				pagination: PAGINATOR.INIT.PAGINATION,
				sort: PAGINATOR.INIT.SORT,
				filter: PAGINATOR.INIT.FILTER,
			};

			setIsLoading(true);
			try {
				const response = await onPage(initRequest, controller.signal);
				setData(response.content);
				setRowCount(response.page.totalElements);
			} catch (ex) {
				if (isAbortError(ex)) return;
				notifyCtx.showSnackbar(`Failed to fetch data: ${parseErrorMessage(ex)}`, 'error');
			}
			setIsLoading(false);
		}

		void initFetch();

		return () => {
			controller.abort();
		};
	}, [notifyCtx, onPage]);

	async function handlePageChange(newPage: GridPaginationModel) {
		setPagination(newPage);
		devLog.debug(`Pagination changed to ${JSON.stringify(newPage)}`);

		const request: PageRequest = { pagination: newPage, sort, filter };
		await requestPage(request);
	}

	async function handleSortChange(newSort: GridSortModel) {
		setSort(newSort);
		devLog.debug(`Page sort changed to ${JSON.stringify(newSort)}`);

		const request: PageRequest = { pagination, sort: newSort, filter };
		await requestPage(request);
	}

	async function handleFilterChange(newFilter: GridFilterModel) {
		setFilter(newFilter);
		devLog.debug(`Filter changed to ${JSON.stringify(newFilter)}`);

		const request: PageRequest = { pagination, sort, filter: newFilter };
		await requestPage(request);
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
				columns={getKeys()}
				rows={data}
				rowCount={rowCount}
				loading={isLoading}
				density="compact"
				editMode="row"
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
