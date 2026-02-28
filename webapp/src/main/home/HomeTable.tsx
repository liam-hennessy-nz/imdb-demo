import { ProgressSpinner } from '@primereact/ui/progressspinner';
import { useEffect, useState } from 'react';
import type { RawNameBasic } from '../raw/entity/RawNameBasic.ts';
import { filterImdbNameBasics } from '../raw/service/imdbNameBasicService.ts';
import { DataTable } from '../shared/component/datatable/DataTable.tsx';
import { PAGINATOR_DEFAULT_SIZE } from '../shared/constant/constants.ts';
import type { FilterRequest } from '../shared/entity/FilterRequest.ts';
import type { PageResponse } from '../shared/entity/PageResponse.ts';

export function HomeTable() {
	const [initPage, setInitPage] = useState<PageResponse<RawNameBasic> | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function initFetch() {
			const request: FilterRequest = {
				page: 0,
				size: PAGINATOR_DEFAULT_SIZE,
				sort: { ['id']: 1 },
			};

			setInitPage(await filterImdbNameBasics(request));
		}
		void initFetch();

		return () => {
			controller.abort();
		};
	}, []);

	return initPage !== null ? (
		<DataTable datasetKey="rawNameBasic" initPage={initPage} onPage={filterImdbNameBasics} />
	) : (
		<ProgressSpinner />
	);
}
