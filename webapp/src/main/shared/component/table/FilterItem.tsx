import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { GridFilterItem } from '@mui/x-data-grid';
import { type ChangeEvent } from 'react';
import { getDatasetConfigEntriesArray, type DatasetKey } from '../../../dataset/entity/Dataset.ts';
import { FILTER } from '../../constant/constants.ts';
import type { Option } from '../../entity/Option.ts';

interface FilterItemProps<K extends DatasetKey> {
	datasetKey: K;
	itemId: number;
	item: GridFilterItem;
	onChange: (id: number, itemPart: Partial<GridFilterItem>) => void;
	onRemove: (id: number) => void;
}

export function FilterItem<K extends DatasetKey>(props: FilterItemProps<K>) {
	const { datasetKey, itemId, item, onChange, onRemove } = props;

	const datasetConfig = getDatasetConfigEntriesArray(datasetKey);

	function getFields() {
		return datasetConfig.map(([key, config]) => ({ key, value: config.label }));
	}

	function getOperators(): Option[] {
		const fieldConfig = datasetConfig.find(([key]) => key === item.field)?.[1];
		if (fieldConfig === undefined) return [];

		return FILTER[fieldConfig.type];
	}

	const fields: Option[] = getFields();
	const operators: Option[] = getOperators();

	function handleFieldChange(ev: SelectChangeEvent) {
		const newField = ev.target.value;
		onChange(itemId, { field: newField, operator: '', value: '' });
	}

	function handleOperatorChange(ev: SelectChangeEvent) {
		const newOperator = ev.target.value;
		onChange(itemId, { operator: newOperator });
	}

	function handleValueChange(ev: ChangeEvent<HTMLInputElement>) {
		const newFilter = ev.target.value;
		onChange(itemId, { value: newFilter });
	}

	function handleRemove() {
		onRemove(itemId);
	}

	return (
		<Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
			<Box sx={{ flex: 1, display: 'flex' }}>
				<FormControl fullWidth size="small">
					<InputLabel>Field</InputLabel>
					<Select value={item.field} onChange={handleFieldChange} label="Field" size="small">
						{fields.map((field) => (
							<MenuItem key={field.key} value={field.key}>
								{field.value}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<Box sx={{ flex: 1, display: 'flex' }}>
				{item.field !== '' && (
					<FormControl fullWidth size="small">
						<InputLabel>Operator</InputLabel>
						<Select value={item.operator} onChange={handleOperatorChange} label="Operator" size="small">
							{operators.map((operator) => (
								<MenuItem key={operator.key} value={operator.key}>
									{operator.value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</Box>

			<Box sx={{ flex: 1, display: 'flex' }}>
				{item.operator !== '' && (
					<TextField value={String(item.value)} onChange={handleValueChange} label="Value" size="small" />
				)}
			</Box>

			<IconButton aria-label="Remove filter" onClick={handleRemove}>
				<CloseIcon />
			</IconButton>
		</Box>
	);
}
