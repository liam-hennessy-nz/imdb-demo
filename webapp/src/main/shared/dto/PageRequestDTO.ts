import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export interface PageRequestDTO {
	pagination: GridPaginationModel;
	sort: GridSortModel;
	filter: GridFilterModel;
}
