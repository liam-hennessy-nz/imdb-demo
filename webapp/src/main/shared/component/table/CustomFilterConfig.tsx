import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { GridFilterItem } from '@mui/x-data-grid';
import type { DatasetKey } from '../../../dataset/entity/Dataset.ts';
import { FilterItem } from './FilterItem.tsx';
import type { StoredFilterModel } from './StoredFilterModel.ts';

interface CustomFilterConfigProps<K extends DatasetKey> {
	datasetKey: K;
	draftFilter: StoredFilterModel | null;
	onDraftFilterItemCreate: () => void;
	onDraftFilterItemUpdate: (id: number, itemPart: Partial<GridFilterItem>) => void;
	onDraftFilterItemRemove: (id: number) => void;
}

export function CustomFilterConfig<K extends DatasetKey>(props: CustomFilterConfigProps<K>) {
	const { datasetKey, draftFilter, onDraftFilterItemCreate, onDraftFilterItemUpdate, onDraftFilterItemRemove } = props;

	function handleDraftFilterItemAdd() {
		onDraftFilterItemCreate();
	}

	function handleDraftFilterItemChange(id: number, itemPart: Partial<GridFilterItem>) {
		onDraftFilterItemUpdate(id, itemPart);
	}

	function handleDraftFilterItemRemove(id: number) {
		onDraftFilterItemRemove(id);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
			{draftFilter !== null ? (
				<>
					{draftFilter.items.map((item) => {
						const itemId = item.id;
						if (typeof itemId !== 'number') return null;

						return (
							<FilterItem
								key={itemId}
								datasetKey={datasetKey}
								itemId={itemId}
								item={item}
								onChange={handleDraftFilterItemChange}
								onRemove={handleDraftFilterItemRemove}
							/>
						);
					})}

					<Button onClick={handleDraftFilterItemAdd}>
						<AddIcon />
						Add Filter Item
					</Button>
				</>
			) : (
				<Typography>No filter selected.</Typography>
			)}
		</Box>
	);
}
