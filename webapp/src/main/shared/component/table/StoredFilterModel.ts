import type { GridFilterModel } from '@mui/x-data-grid';

export interface StoredFilterModel extends GridFilterModel {
	name: string;
}
