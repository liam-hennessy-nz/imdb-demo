import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import type { GridFilterItem, GridFilterModel } from '@mui/x-data-grid';
import { type DatasetKey } from '../../../dataset/entity/Dataset.ts';
import { CustomFilterActions } from './CustomFilterActions.tsx';
import { CustomFilterConfig } from './CustomFilterConfig.tsx';
import type { StoredFilterModel } from './StoredFilterModel.ts';

interface DatasetFilterPanelProps<K extends DatasetKey> {
	datasetKey: K;
	filters: StoredFilterModel[];
	selectedFilter: string | null;
	draftFilter: StoredFilterModel | null;
	onFilterCreate: (name: string) => void;
	onFilterSelect: (name: string | null) => void;
	onFilterApply: () => Promise<void>;
	onFilterUpdate: (name: string, filterPart: Partial<GridFilterModel>) => void;
	onFilterRename: (name: string, newName: string) => void;
	onFilterImport: (name: string, filter: GridFilterModel) => void;
	onFilterRemove: (name: string) => void;
	onDraftFilterItemCreate: () => void;
	onDraftFilterItemUpdate: (index: number, itemPart: Partial<GridFilterItem>) => void;
	onDraftFilterItemRemove: (index: number) => void;
}

export function CustomFilterPanel<K extends DatasetKey>(props: DatasetFilterPanelProps<K>) {
	const {
		datasetKey,
		filters,
		selectedFilter,
		draftFilter,
		onFilterCreate,
		onFilterSelect,
		onFilterApply,
		onFilterUpdate,
		onFilterRename,
		onFilterImport,
		onFilterRemove,
		onDraftFilterItemCreate,
		onDraftFilterItemUpdate,
		onDraftFilterItemRemove,
	} = props;

	return (
		<Paper sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2, width: 700 }}>
			<CustomFilterActions
				filters={filters}
				selectedFilter={selectedFilter}
				draftFilter={draftFilter}
				onFilterCreate={onFilterCreate}
				onFilterSelect={onFilterSelect}
				onFilterApply={onFilterApply}
				onFilterUpdate={onFilterUpdate}
				onFilterRename={onFilterRename}
				onFilterImport={onFilterImport}
				onFilterRemove={onFilterRemove}
			/>

			<Divider />

			<CustomFilterConfig
				datasetKey={datasetKey}
				draftFilter={draftFilter}
				onDraftFilterItemCreate={onDraftFilterItemCreate}
				onDraftFilterItemUpdate={onDraftFilterItemUpdate}
				onDraftFilterItemRemove={onDraftFilterItemRemove}
			/>
		</Paper>
	);
}
