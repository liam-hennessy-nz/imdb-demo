import type { GridFilterItem, GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import type { DatasetKey, DatasetMap } from '../../../dataset/entity/Dataset.ts';
import { PAGINATOR } from '../../constant/constants.ts';
import type { StoredFilterModel } from './StoredFilterModel.ts';

interface TableState<K extends DatasetKey> {
	datasetKey: K;
	data: DatasetMap[K][];
	rowCount: number;

	isLoading: boolean;

	pagination: GridPaginationModel;
	sort: GridSortModel;

	filters: StoredFilterModel[];
	selectedFilter: string | null;
	draftFilter: StoredFilterModel | null;
}

export type FilterAction<K extends DatasetKey> =
	| { type: 'DATA_UPDATED'; data: DatasetMap[K][] }
	| { type: 'ROW_COUNT_UPDATED'; rowCount: number }
	| { type: 'DATA_LOADING' }
	| { type: 'DATA_LOADED' }
	| { type: 'PAGINATION_UPDATED'; paginationPart: Partial<GridPaginationModel> }
	| { type: 'SORT_UPDATED'; sort: GridSortModel }
	| { type: 'FILTER_CREATED'; name: string }
	| { type: 'FILTER_SELECTED'; name: string | null }
	| { type: 'FILTER_UPDATED'; name: string; filterPart: Partial<GridFilterModel> }
	| { type: 'FILTER_RENAMED'; name: string; newName: string }
	| { type: 'FILTER_IMPORTED'; name: string; filter: GridFilterModel }
	| { type: 'FILTER_REMOVED'; name: string }
	| { type: 'DRAFT_FILTER_ITEM_CREATED' }
	| { type: 'DRAFT_FILTER_ITEM_UPDATED'; id: number; itemPart: Partial<GridFilterItem> }
	| { type: 'DRAFT_FILTER_ITEM_REMOVED'; id: number }
	| { type: 'DRAFT_FILTER_ITEMS_CLEARED' };

export const TABLE_REDUCER_DEFAULTS = {
	data: [],
	rowCount: 0,
	isLoading: false,
	pagination: PAGINATOR.INIT.PAGINATION,
	sort: PAGINATOR.INIT.SORT,
	filters: [],
	selectedFilter: null,
	draftFilter: null,
	nextDraftFilterItemId: 0,
};

export function tableReducer<K extends DatasetKey>(state: TableState<K>, action: FilterAction<K>): TableState<K> {
	function getNextFilterItemId(filter: StoredFilterModel) {
		const ids = filter.items.map((item) => item.id).filter((id): id is number => typeof id === 'number');

		return ids.length === 0 ? 0 : Math.max(...ids) + 1;
	}

	switch (action.type) {
		case 'DATA_UPDATED': {
			return { ...state, data: action.data };
		}

		case 'ROW_COUNT_UPDATED': {
			return { ...state, rowCount: action.rowCount };
		}

		case 'DATA_LOADING': {
			return { ...state, isLoading: true };
		}

		case 'DATA_LOADED': {
			return { ...state, isLoading: false };
		}

		case 'PAGINATION_UPDATED': {
			return { ...state, pagination: { ...state.pagination, ...action.paginationPart } };
		}

		case 'SORT_UPDATED': {
			return { ...state, sort: action.sort };
		}

		case 'FILTER_CREATED': {
			const newFilter: StoredFilterModel = { name: action.name, items: [] };
			return {
				...state,
				filters: [...state.filters, newFilter].sort((a, b) => a.name.localeCompare(b.name)),
				selectedFilter: newFilter.name,
				draftFilter: newFilter,
			};
		}

		case 'FILTER_SELECTED': {
			if (action.name === null) return { ...state, selectedFilter: null, draftFilter: null };

			const foundFilter = state.filters.find((filter) => filter.name === action.name);
			if (foundFilter === undefined) return state;

			return { ...state, selectedFilter: foundFilter.name, draftFilter: foundFilter };
		}

		case 'FILTER_UPDATED': {
			const foundFilter = state.filters.find((filter) => filter.name === action.name);

			const newFilter: StoredFilterModel = {
				name: action.name,
				...action.filterPart,
				items: [...(action.filterPart.items ?? [])],
			};

			const newFilters =
				foundFilter === undefined
					? [...state.filters, newFilter]
					: state.filters.map((filter) => (filter.name === action.name ? newFilter : filter));

			return { ...state, filters: newFilters };
		}

		case 'FILTER_RENAMED': {
			return {
				...state,
				filters: state.filters
					.map((filter) => (filter.name === action.name ? { ...filter, name: action.newName } : filter))
					.sort((a, b) => a.name.localeCompare(b.name)),
				selectedFilter: action.newName,
			};
		}

		case 'FILTER_IMPORTED': {
			const draftFilter = state.draftFilter;
			if (draftFilter === null) return state;

			const foundFilter = state.filters.find((filter) => filter.name === action.name);

			const newFilter: StoredFilterModel = {
				name: action.name,
				...action.filter,
				items: [...draftFilter.items],
			};

			for (const item of action.filter.items) {
				const itemId = getNextFilterItemId(newFilter);
				newFilter.items.push({ ...item, id: itemId });
			}

			const newFilters =
				foundFilter === undefined
					? [...state.filters, newFilter]
					: state.filters.map((filter) => (filter.name === action.name ? newFilter : filter));

			return { ...state, filters: newFilters, draftFilter: newFilter };
		}

		case 'FILTER_REMOVED': {
			const newFilters: StoredFilterModel[] = state.filters.filter((filter) => filter.name !== action.name);
			return { ...state, filters: newFilters, selectedFilter: null, draftFilter: null };
		}

		case 'DRAFT_FILTER_ITEM_CREATED': {
			const draftFilter = state.draftFilter;
			if (draftFilter === null) return state;

			return {
				...state,
				draftFilter: {
					...draftFilter,
					items: [...draftFilter.items, { id: getNextFilterItemId(draftFilter), field: '', operator: '', value: '' }],
				},
			};
		}

		case 'DRAFT_FILTER_ITEM_UPDATED': {
			const draftFilter = state.draftFilter;
			if (draftFilter === null) return state;

			return {
				...state,
				draftFilter: {
					...draftFilter,
					items: draftFilter.items.map((item) => (item.id === action.id ? { ...item, ...action.itemPart } : item)),
				},
			};
		}

		case 'DRAFT_FILTER_ITEM_REMOVED': {
			const draftFilter = state.draftFilter;
			if (draftFilter === null) return state;

			return {
				...state,
				draftFilter: {
					...draftFilter,
					items: draftFilter.items.filter((item) => item.id !== action.id),
				},
			};
		}

		case 'DRAFT_FILTER_ITEMS_CLEARED': {
			const draftFilter = state.draftFilter;
			if (draftFilter === null) return state;

			return { ...state, draftFilter: { ...draftFilter, items: [] } };
		}
	}
}
