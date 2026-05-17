import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export interface PageRequest {
	pagination: GridPaginationModel;
	sort: GridSortModel;
	filter: GridFilterModel;
}
