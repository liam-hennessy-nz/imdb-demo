import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import {
	DataGrid,
	GridColumnMenu,
	type GridColDef,
	type GridColumnMenuProps,
	type GridFilterItem,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from '@mui/x-data-grid';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { DATASET_CONFIGS, type DatasetKey, type DatasetMap, type KeyConfig } from '../../../dataset/entity/Dataset.ts';
import { useNotifyContext } from '../../../notify/context/NotifyContext.ts';
import { STORAGE } from '../../../storage/constant/storageConstants.ts';
import { useStorageContext } from '../../../storage/context/StorageContext.ts';
import { PAGINATOR } from '../../constant/constants.ts';
import type { PageRequest } from '../../dto/PageRequest.ts';
import type { PageResponseDTO } from '../../dto/PageResponseDTO.ts';
import { isAbortError, parseErrorMessage, toPageRequest, toUrlSearchParams } from '../../util/commonFunctions.ts';
import { CustomColumnMenuFilterItem } from './CustomColumnMenuFilterItem.tsx';
import { CustomFilterPanel } from './CustomFilterPanel.tsx';
import { TABLE_REDUCER_DEFAULTS, tableReducer } from './tableReducer.ts';

interface CustomTableProps<K extends DatasetKey> {
	datasetKey: K;
	onPage: (request: PageRequest, abortSignal: AbortSignal) => Promise<PageResponseDTO<DatasetMap[K]>>;
	getRowId?: (row: DatasetMap[K]) => string | number;
	doReadSearchParams?: boolean;
	doWriteSearchParams?: boolean;
}

export function CustomTable<K extends DatasetKey>(props: CustomTableProps<K>) {
	const { datasetKey, onPage, getRowId, doReadSearchParams = true, doWriteSearchParams = true } = props;

	const [searchParams, setSearchParams] = useSearchParams();
	const storageCtx = useStorageContext();
	const notifyCtx = useNotifyContext();

	const abortController = useRef<AbortController | null>(null);
	const paperRef = useRef<HTMLDivElement | null>(null);

	const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

	const [tableState, dispatchTableState] = useReducer(tableReducer, {
		datasetKey,
		...TABLE_REDUCER_DEFAULTS,
		filters: storageCtx.find(STORAGE.KEYS.FILTERS) ?? [],
	});

	function getSelectedFilter() {
		return tableState.filters.find((filter) => filter.name === tableState.selectedFilter);
	}

	async function requestPage(request: PageRequest) {
		if (abortController.current !== null) abortController.current.abort();
		abortController.current = new AbortController();

		dispatchTableState({ type: 'DATA_LOADING' });
		try {
			const response = await onPage(request, abortController.current.signal);
			dispatchTableState({ type: 'DATA_UPDATED', data: response.content });
			dispatchTableState({ type: 'ROW_COUNT_UPDATED', rowCount: response.page.totalElements });
		} catch (ex) {
			if (isAbortError(ex)) return;
			notifyCtx.showSnackbar(`Failed to fetch data: ${parseErrorMessage(ex)}`, 'error');
		}
		dispatchTableState({ type: 'DATA_LOADED' });
	}

	function getKeys(): GridColDef[] {
		const datasetConfig = DATASET_CONFIGS[datasetKey];

		return Object.entries(datasetConfig.keys as Record<DatasetKey, KeyConfig>).map(([key, value]) => ({
			field: key,
			headerName: value.label,
			type: value.type,
			flex: value.flex,
			editable: value.editable,
		}));
	}

	/**
	 * Grab data as soon as the component mounts.
	 */
	useEffect(() => {
		function initRequest(): PageRequest {
			// If a search param read is requested and search params exist, build the initial request from them.
			// Otherwise, use the default initial request.
			if (doReadSearchParams && searchParams.size > 0) {
				const pageRequest = toPageRequest(searchParams);
				dispatchTableState({ type: 'PAGINATION_UPDATED', paginationPart: pageRequest.pagination });
				return pageRequest;
			}
			return {
				pagination: PAGINATOR.INIT.PAGINATION,
				sort: PAGINATOR.INIT.SORT,
				filter: PAGINATOR.INIT.FILTER,
			};
		}

		async function initFetch() {
			if (abortController.current !== null) abortController.current.abort();
			abortController.current = new AbortController();

			dispatchTableState({ type: 'DATA_LOADING' });
			try {
				const response = await onPage(initRequest(), abortController.current.signal);
				dispatchTableState({ type: 'DATA_UPDATED', data: response.content });
				dispatchTableState({ type: 'ROW_COUNT_UPDATED', rowCount: response.page.totalElements });
			} catch (ex) {
				if (isAbortError(ex)) return;
				notifyCtx.showSnackbar(`Failed to fetch data: ${parseErrorMessage(ex)}`, 'error');
			}
			dispatchTableState({ type: 'DATA_LOADED' });
		}

		void initFetch();

		return () => {
			abortController.current?.abort();
		};
	}, [notifyCtx, searchParams, onPage, doReadSearchParams]);

	/**
	 * Update local storage whenever the filters change.
	 */
	useEffect(() => {
		storageCtx.set(STORAGE.KEYS.FILTERS, JSON.stringify(tableState.filters));
	}, [storageCtx, tableState.filters]);

	async function handlePaginationChange(pagination: GridPaginationModel) {
		const pageRequest: PageRequest = {
			pagination,
			sort: tableState.sort,
			filter: tableState.draftFilter ?? getSelectedFilter() ?? PAGINATOR.INIT.FILTER,
		};

		if (doWriteSearchParams) setSearchParams(toUrlSearchParams(pageRequest));
		dispatchTableState({ type: 'PAGINATION_UPDATED', paginationPart: pagination });
		await requestPage(pageRequest);
	}

	async function handleSortChange(sort: GridSortModel) {
		const pageRequest: PageRequest = {
			pagination: tableState.pagination,
			sort,
			filter: tableState.draftFilter ?? getSelectedFilter() ?? PAGINATOR.INIT.FILTER,
		};

		if (doWriteSearchParams) setSearchParams(toUrlSearchParams(pageRequest));
		dispatchTableState({ type: 'SORT_UPDATED', sort });
		await requestPage(pageRequest);
	}

	function handleFilterCreate(name: string) {
		dispatchTableState({ type: 'FILTER_CREATED', name });
	}

	function handleFilterSelect(name: string | null) {
		dispatchTableState({ type: 'FILTER_SELECTED', name });
	}

	async function handleFilterApply() {
		const pageRequest: PageRequest = {
			pagination: tableState.pagination,
			sort: tableState.sort,
			filter: tableState.draftFilter ?? getSelectedFilter() ?? PAGINATOR.INIT.FILTER,
		};

		if (doWriteSearchParams) setSearchParams(toUrlSearchParams(pageRequest));
		await requestPage(pageRequest);
	}

	function handleFilterUpdate(name: string, filterPart: Partial<GridFilterModel>) {
		dispatchTableState({ type: 'FILTER_UPDATED', name, filterPart });
	}

	function handleFilterRename(name: string, newName: string) {
		dispatchTableState({ type: 'FILTER_RENAMED', name, newName });
	}

	function handleFilterImport(name: string, filter: GridFilterModel) {
		dispatchTableState({ type: 'FILTER_IMPORTED', name, filter });
	}

	function handleFilterRemove(name: string) {
		dispatchTableState({ type: 'FILTER_REMOVED', name });
	}

	function handleDraftFilterItemCreate() {
		dispatchTableState({ type: 'DRAFT_FILTER_ITEM_CREATED' });
	}

	function handleDraftFilterItemUpdate(id: number, itemPart: Partial<GridFilterItem>) {
		dispatchTableState({ type: 'DRAFT_FILTER_ITEM_UPDATED', id, itemPart });
	}

	function handleDraftFilterItemRemove(id: number) {
		dispatchTableState({ type: 'DRAFT_FILTER_ITEM_REMOVED', id });
	}

	function handleFilterPopoverOpen() {
		setAnchorEl(paperRef.current);
		setIsFilterOpen(true);
	}

	function handleFilterPopoverClose() {
		setIsFilterOpen(false);
		setAnchorEl(null);
	}

	function customColumnMenu(props: GridColumnMenuProps) {
		function customColumnMenuFilterItem() {
			return <CustomColumnMenuFilterItem onClick={handleFilterPopoverOpen} hideMenu={props.hideMenu} />;
		}
		return <GridColumnMenu {...props} slots={{ columnMenuFilterItem: customColumnMenuFilterItem }} />;
	}

	return (
		<Paper ref={paperRef} sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
			<DataGrid
				columns={getKeys()}
				rows={tableState.data}
				rowCount={tableState.rowCount}
				getRowId={getRowId}
				loading={tableState.isLoading}
				density="compact"
				editMode="row"
				pagination
				pageSizeOptions={PAGINATOR.PAGE_SIZE_OPTIONS}
				paginationModel={tableState.pagination}
				sortModel={tableState.sort}
				paginationMode="server"
				sortingMode="server"
				filterMode="server"
				onPaginationModelChange={(pagination) => void handlePaginationChange(pagination)}
				onSortModelChange={(sort) => void handleSortChange(sort)}
				slots={{ columnMenu: customColumnMenu }}
				sx={{ minHeight: 250 }}
			/>

			<Popover
				open={isFilterOpen}
				onClose={handleFilterPopoverClose}
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 40, horizontal: 'right' }}
			>
				<CustomFilterPanel
					datasetKey={datasetKey}
					filters={tableState.filters}
					selectedFilter={tableState.selectedFilter}
					draftFilter={tableState.draftFilter}
					onFilterCreate={handleFilterCreate}
					onFilterSelect={handleFilterSelect}
					onFilterApply={handleFilterApply}
					onFilterUpdate={handleFilterUpdate}
					onFilterRename={handleFilterRename}
					onFilterImport={handleFilterImport}
					onFilterRemove={handleFilterRemove}
					onDraftFilterItemCreate={handleDraftFilterItemCreate}
					onDraftFilterItemUpdate={handleDraftFilterItemUpdate}
					onDraftFilterItemRemove={handleDraftFilterItemRemove}
				/>
			</Popover>
		</Paper>
	);
}
