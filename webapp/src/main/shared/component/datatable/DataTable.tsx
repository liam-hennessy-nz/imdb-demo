import type { useInputNumberValueChangeEvent } from '@primereact/types/shared/inputnumber';
import type { usePaginatorChangeEvent } from '@primereact/types/shared/paginator';
import { DataView } from '@primereact/ui/dataview';
import { InputNumber } from '@primereact/ui/inputnumber';
import { Paginator } from '@primereact/ui/paginator';
import { useState } from 'react';
import { PAGINATOR_DEFAULT_SIZE } from '../../constant/constants.ts';
import { labelsFor, type DatasetKey, type TypeFromDatasetKey } from '../../entity/Datasets.ts';
import type { FilterRequest, FilterType, SortType } from '../../entity/FilterRequest.ts';
import type { PageResponse } from '../../entity/PageResponse.ts';
import { devLog } from '../../util/devLog.ts';

interface DataTableProps<K extends DatasetKey> {
	datasetKey: K;
	initPage: PageResponse<TypeFromDatasetKey<K>>;
	emptyMessage?: string;
	onPage: (request: FilterRequest) => Promise<PageResponse<TypeFromDatasetKey<K>>>;
}

export function DataTable<K extends DatasetKey>(props: DataTableProps<K>) {
	const { datasetKey, initPage, emptyMessage = 'No data to display.', onPage } = props;

	const [data, setData] = useState<TypeFromDatasetKey<K>[]>(initPage.content);

	const [pageNumber, setPageNumber] = useState<number>(initPage.page.number);
	const [pageSize, setPageSize] = useState<number>(initPage.page.size);
	const [totalElements, setTotalElements] = useState<number>(initPage.page.totalElements);

	const [sort, setSort] = useState<SortType>({ ['id']: 1 });
	const [filter, setFilter] = useState<FilterType>({});

	async function requestPage(request: FilterRequest) {
		const response = await onPage(request);
		setData(response.content);
		setTotalElements(response.page.totalElements);
		setSort({});
		setFilter({});
	}

	async function handlePageChange(e: usePaginatorChangeEvent) {
		const newPageNumber = e.value;
		if (newPageNumber === pageNumber) return;

		setPageNumber(newPageNumber);
		devLog.debug(`Paginated to page ${newPageNumber}`);

		const request: FilterRequest = {
			page: Math.max(newPageNumber - 1, 0),
			size: pageSize,
			sort: sort,
			filter: filter,
		};

		await requestPage(request);
	}

	async function handlePageSizeChange(e: useInputNumberValueChangeEvent) {
		const newPageSize = e.value;
		if (newPageSize === pageSize) return;

		setPageSize(e.value);
		devLog.debug(`Page size changed to ${newPageSize}`);

		const request: FilterRequest = {
			page: Math.max(pageNumber - 1, 0),
			size: newPageSize,
			sort: sort,
			filter: filter,
		};

		await requestPage(request);
	}

	function headerTemplate() {
		return (
			<div className="flex flex-1">
				{labelsFor(datasetKey).map((label, index) => {
					const key = `header-${index}`;
					return (
						<div key={key} className="flex-1">
							{label}
						</div>
					);
				})}
			</div>
		);
	}

	function rowTemplate(row: TypeFromDatasetKey<K>) {
		return Object.values(row).map((item, index) => {
			const key = `item-${index}`;
			return <div key={key}>{JSON.stringify(item)}</div>;
		});
	}

	return (
		<div className="flex flex-1">
			<DataView className="flex flex-1 flex-col gap-8">
				{data.length > 0 ? (
					<div className="flex flex-col gap-2">
						{headerTemplate()}
						{data.map((row, index) => {
							const key = `title-item-${index}`;
							return (
								<div key={key} className="flex flex-1">
									{rowTemplate(row)}
								</div>
							);
						})}
					</div>
				) : (
					<div>{emptyMessage}</div>
				)}
				<Paginator.Root
					total={totalElements}
					itemsPerPage={pageSize}
					page={pageNumber}
					onPageChange={(e: usePaginatorChangeEvent) => void handlePageChange(e)}
				>
					<Paginator.Content>
						<Paginator.First />
						<Paginator.Prev />
						<Paginator.Pages />
						<Paginator.Next />
						<Paginator.Last />
						<div className="flex flex-col w-12">
							<InputNumber
								min={5}
								max={35}
								fluid
								defaultValue={PAGINATOR_DEFAULT_SIZE}
								onValueChange={(e: useInputNumberValueChangeEvent) => void handlePageSizeChange(e)}
							/>
						</div>
					</Paginator.Content>
				</Paginator.Root>
			</DataView>
		</div>
	);
}
