import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import type { RawNameBasic } from '../raw/entity/RawNameBasic.ts';
import { filterImdbNameBasics } from '../raw/service/imdbNameBasicService.ts';
import { DatasetTable } from '../shared/component/datatable/DatasetTable.tsx';
import { PAGINATOR } from '../shared/constant/constants.ts';
import type { FilterRequest } from '../shared/entity/FilterRequest.ts';
import type { PageResponse } from '../shared/entity/PageResponse.ts';

export function HomeTable() {
	const [initPage, setInitPage] = useState<PageResponse<RawNameBasic> | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function initFetch() {
			const request: FilterRequest = {
				number: 0,
				size: PAGINATOR.DEFAULT_SIZE,
				sort: { ['id']: 1 },
			};

			setInitPage(await filterImdbNameBasics(request));
		}
		void initFetch();

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			{initPage !== null ? (
				<DatasetTable datasetKey="rawNameBasic" initPage={initPage} onPage={filterImdbNameBasics} />
			) : (
				<CircularProgress aria-label="Loading..." />
			)}
		</Box>
	);
}
