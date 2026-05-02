import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import type { RawNameBasic } from '../../raw/entity/RawNameBasic.ts';
import { filterImdbNameBasics } from '../../raw/service/imdbNameBasicService.ts';
import { DatasetTable } from '../../shared/component/table/DatasetTable.tsx';
import { PAGINATOR } from '../../shared/constant/constants.ts';
import type { PageRequestDTO } from '../../shared/dto/PageRequestDTO.ts';
import type { PageResponseDTO } from '../../shared/dto/PageResponseDTO.ts';

export function HomeTable() {
	const [initPage, setInitPage] = useState<PageResponseDTO<RawNameBasic> | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function initFetch() {
			const request: PageRequestDTO = {
				pagination: PAGINATOR.INIT.PAGINATION,
				sort: PAGINATOR.INIT.SORT,
				filter: PAGINATOR.INIT.FILTER,
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
