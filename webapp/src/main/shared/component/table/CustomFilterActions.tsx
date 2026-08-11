import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import type { GridFilterModel } from '@mui/x-data-grid';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router';
import { toPageRequest } from '../../util/commonFunctions.ts';
import type { StoredFilterModel } from './StoredFilterModel.ts';

interface CustomFilterActionsProps {
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
}

export function CustomFilterActions(props: CustomFilterActionsProps) {
	const {
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
	} = props;

	const [searchParams] = useSearchParams();

	const [newFilterName, setNewFilterName] = useState<string | null>(null);
	const [isCreatingFilter, setIsCreatingFilter] = useState<boolean>(false);
	const [isRenamingFilter, setIsRenamingFilter] = useState<boolean>(false);

	function handleFilterBeginCreate() {
		onFilterSelect(null);
		setIsCreatingFilter(true);
	}

	function handleFilterCreate() {
		if (newFilterName === null) return;

		onFilterCreate(newFilterName);
		setNewFilterName(null);
		setIsCreatingFilter(false);
	}

	function handleFilterCreateKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
		if (ev.key === 'Enter') {
			handleFilterCreate();
		}
		if (ev.key === 'Escape') {
			ev.stopPropagation();
			handleFilterCreateCancel();
		}
	}

	function handleFilterCreateCancel() {
		setNewFilterName(null);
		setIsCreatingFilter(false);
	}

	function handleFilterBeginRename(name: string) {
		setNewFilterName(name);
		setIsRenamingFilter(true);
	}

	function handleFilterRename() {
		if (selectedFilter === null || newFilterName === null) return;

		onFilterRename(selectedFilter, newFilterName);
		setNewFilterName(null);
		setIsRenamingFilter(false);
	}

	function handleFilterRenameKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
		if (ev.key === 'Enter') {
			handleFilterRename();
		}
		if (ev.key === 'Escape') {
			ev.stopPropagation();
			handleFilterRenameCancel();
		}
	}

	function handleFilterRenameCancel() {
		setNewFilterName(null);
		setIsRenamingFilter(false);
	}

	function handleFilterNameChange(ev: ChangeEvent<HTMLInputElement>) {
		setNewFilterName(ev.target.value);
	}

	function handleFilterSelect(ev: SelectChangeEvent) {
		onFilterSelect(ev.target.value);
	}

	function handleFilterApply() {
		void onFilterApply();
	}

	function handleFilterImport() {
		if (selectedFilter === null) return;

		const newFilter = toPageRequest(searchParams).filter;
		onFilterImport(selectedFilter, newFilter);
	}

	function handleFilterSave() {
		if (selectedFilter === null || draftFilter === null) return;

		onFilterUpdate(selectedFilter, draftFilter);
	}

	function handleFilterDelete() {
		if (selectedFilter === null) return;

		onFilterRemove(selectedFilter);
	}

	return (
		<Box sx={{ display: 'flex', gap: 2 }}>
			{isCreatingFilter || isRenamingFilter ? (
				<TextField
					value={newFilterName ?? ''}
					fullWidth
					size="small"
					label="Filter Name"
					autoFocus
					onKeyDown={isCreatingFilter ? handleFilterCreateKeyDown : handleFilterRenameKeyDown}
					onChange={handleFilterNameChange}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end" sx={{ gap: 1 }}>
									<Tooltip title="Confirm">
										<IconButton
											aria-label="Confirm filter rename"
											onClick={isCreatingFilter ? handleFilterCreate : handleFilterRename}
											edge="end"
										>
											<CheckIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Cancel">
										<IconButton
											aria-label="Cancel filter rename"
											onClick={isCreatingFilter ? handleFilterCreateCancel : handleFilterRenameCancel}
											edge="end"
										>
											<CancelIcon />
										</IconButton>
									</Tooltip>
								</InputAdornment>
							),
						},
					}}
				/>
			) : (
				<FormControl fullWidth size="small">
					<InputLabel>Filter Name</InputLabel>
					<Select
						value={selectedFilter ?? ''}
						onChange={handleFilterSelect}
						size="small"
						label="Filter Name"
						renderValue={(value) => value}
					>
						{filters.map((filter) => (
							<MenuItem key={filter.name} value={filter.name}>
								<ListItemText primary={filter.name} />
								<Tooltip title="Rename filter" placement="right">
									<IconButton
										aria-label="Rename filter"
										size="small"
										edge="end"
										onClick={() => {
											handleFilterBeginRename(filter.name);
										}}
									>
										<EditIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}

			<Tooltip title="New Filter">
				<IconButton aria-label="New filter" onClick={handleFilterBeginCreate}>
					<AddIcon />
				</IconButton>
			</Tooltip>

			<Tooltip title="Apply Filter">
				<IconButton aria-label="Apply filter" onClick={handleFilterApply}>
					<CheckIcon />
				</IconButton>
			</Tooltip>

			<Tooltip title="Import Filter from URL">
				<IconButton aria-label="Import filter from URL" onClick={handleFilterImport}>
					<LinkIcon />
				</IconButton>
			</Tooltip>

			<Tooltip title="Save Filter">
				<IconButton aria-label="Save filter" onClick={handleFilterSave}>
					<SaveIcon />
				</IconButton>
			</Tooltip>

			<Tooltip title="Delete Filter">
				<IconButton aria-label="Delete filter" onClick={handleFilterDelete}>
					<DeleteForeverIcon />
				</IconButton>
			</Tooltip>
		</Box>
	);
}
