import type { DataTableFilterMeta, DataTableSortMeta } from 'primereact/datatable';

export interface FilterRequest {
	page?: number;
	size?: number;
	sort?: DataTableSortMeta[] | null;
	filter?: DataTableFilterMeta;
}
