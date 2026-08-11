import type { GridColType, GridFilterItem, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import type { Option } from '../entity/Option.ts';

export const WEBSOCKET = {
	CONNECT: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 5000,
		DO_RETRY_ON_FAIL: true,
	},
	VALIDATE: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		DO_RETRY_ON_FAIL: true,
		FILE_SNIPPET_SIZE_BYTES: 64 * 1024,
	},
	SEND: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		DO_RETRY_ON_FAIL: true,
	},
	CHUNK: {
		MAX_ATTEMPTS: 10,
		TIMEOUT_MS: 2000,
		DO_RETRY_ON_FAIL: true,
	},
} as const;

export const PAGINATOR = {
	INIT: {
		PAGINATION: { page: 0, pageSize: 25 },
		SORT: [{ field: 'id', sort: 'asc' }] as GridSortModel,
		FILTER: { items: [] as GridFilterItem[] } as GridFilterModel,
	},
	PAGE_SIZE_OPTIONS: [5, 10, 15, 25, 50, 100],
} as const;

const COMMON_FILTER: Option[] = [
	{ key: 'isEmpty', value: 'Is Empty' },
	{ key: 'isNotEmpty', value: 'Is Not Empty' },
	{ key: 'isAnyOf', value: 'Is Any Of' },
] as const;

export const FILTER: Record<GridColType, Option[]> = {
	string: [
		{ key: 'contains', value: 'Contains' },
		{ key: 'doesNotContain', value: 'Does Not Contain' },
		{ key: 'equals', value: 'Equals' },
		{ key: 'doesNotEqual', value: 'Does Not Equal' },
		{ key: 'startsWith', value: 'Starts With' },
		{ key: 'endsWith', value: 'Ends With' },
		...COMMON_FILTER,
	],
	number: [
		{ key: '=', value: 'Equal To' },
		{ key: '!=', value: 'Not Equal To' },
		{ key: '>', value: 'Greater Than' },
		{ key: '>=', value: 'Greater or Equal To' },
		{ key: '<', value: 'Less Than' },
		{ key: '<=', value: 'Less or Equal To' },
		...COMMON_FILTER,
	],
	date: [
		{ key: 'is', value: 'Is' },
		{ key: 'not', value: 'Is Not' },
		{ key: 'after', value: 'Is After' },
		{ key: 'onOrAfter', value: 'On or After' },
		{ key: 'before', value: 'Before' },
		{ key: 'onOrBefore', value: 'On or Before' },
		...COMMON_FILTER,
	],
	boolean: [{ key: 'eq', value: 'Equals' }],
	dateTime: [],
	singleSelect: [],
	multiSelect: [],
	actions: [],
	custom: [],
	longText: [],
} as const;
