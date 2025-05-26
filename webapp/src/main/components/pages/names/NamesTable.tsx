import {
	DataTable,
	type DataTableFilterMeta,
	type DataTableSortMeta,
	type DataTableStateEvent,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { ImdbNameBasic } from '../../../entities/imdb/ImdbNameBasic.ts';
import type { PageResponse } from '../../../entities/PageResponse.ts';
import { useEffect, useState } from 'react';
import type { FilterRequest } from '../../../entities/FilterRequest.ts';

interface NamesTableProps {
	names: PageResponse<ImdbNameBasic> | null;
	loading: boolean;
	onPage: (props: FilterRequest) => Promise<void>;
}

/**
 * Functional component that houses a DataTable for displaying a paged {@link ImdbNameBasic} table.
 * @param names A {@link PageResponse} object of type {@link ImdbNameBasic}.
 * @param loading A boolean to be set to true when fetching names.
 * @param onPage Callback function for fetching new names.
 * @constructor
 */
function NamesTable({ names, loading, onPage }: NamesTableProps) {
	const [first, setFirst] = useState<number>();
	const [size, setSize] = useState<number>();
	const [totalElements, setTotalElements] = useState<number>();
	const [sort, setSort] = useState<DataTableSortMeta[] | null>();
	const [filter, setFilter] = useState<DataTableFilterMeta>();

	/**
	 * Helper function which sends a page request containing new `page` and `rows` data. Other props are retrieved from
	 * local states.
	 * @param e The `onPage` event from PrimeReacts DataTable.
	 */
	async function handlePage(e: DataTableStateEvent) {
		const props: FilterRequest = {
			page: e.first / e.rows,
			size: e.rows,
			sort,
			filter,
		};
		await onPage(props);
	}

	/**
	 * Helper function which updates the local state for `sortField` and `sortOrder`. A page request is then made
	 * containing these, a `page` of `0` to reset the current page, and the local states for `rows` and `filters`.
	 * @param e The `onSort` event from PrimeReacts DataTable.
	 */
	async function handleSort(e: DataTableStateEvent) {
		setSort(e.multiSortMeta);

		const props: FilterRequest = {
			page: 0,
			size,
			sort: e.multiSortMeta,
			filter,
		};
		await onPage(props);
	}

	/**
	 * Helper function which updates the local state for `filters`. A page request is then made containing these, a `page`
	 * of `0` to reset the current page, and the local states for `rows`, `sortField` and `sortOrder`.
	 * @param e The `onFilter` event from PrimeReacts DataTable.
	 */
	async function handleFilter(e: DataTableStateEvent) {
		setFilter(e.filters);

		const props: FilterRequest = {
			page: 0,
			size,
			sort,
			filter: e.filters,
		};
		await onPage(props);
	}

	/**
	 * UseEffect runs when `names` updates from parent component, populating `first`, `rows` and `totalElements` for the
	 * DataTable to access.
	 */
	useEffect(() => {
		setFirst(names ? names.page.number * names.page.size : 0);
		setSize(names?.page.size ?? 0);
		setTotalElements(names?.page.totalElements ?? 0);
	}, [names]);

	return (
		<DataTable
			value={names?.content}
			first={first}
			rows={size}
			totalRecords={totalElements}
			multiSortMeta={sort}
			filters={filter}
			loading={loading}
			onPage={(e) => void handlePage(e)}
			onSort={(e) => void handleSort(e)}
			onFilter={(e) => void handleFilter(e)}
			paginator
			lazy
			scrollable
			scrollHeight="flex"
			sortMode="multiple"
			removableSort
			dataKey="id"
			style={{ width: '100%', height: '100%' }}
		>
			<Column field="nconst" header="Nconst" dataType="text" filter sortable />
			<Column field="primaryName" header="Name" dataType="text" filter sortable />
			<Column field="birthYear" header="Birth Year" dataType="text" filter sortable />
			<Column field="deathYear" header="Death Year" dataType="text" filter sortable />
			<Column field="primaryProfession" header="Profession" dataType="text" filter sortable />
			<Column field="knownForTitles" header="Known For" dataType="text" filter sortable />
		</DataTable>
	);
}

export default NamesTable;
