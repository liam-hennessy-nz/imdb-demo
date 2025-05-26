import NamesTable from './NamesTable.tsx';
import { useEffect, useState } from 'react';
import type { ImdbNameBasic } from '../../../entities/imdb/ImdbNameBasic.ts';
import { filterImdbNameBasics } from '../../../services/imdb/ImdbNameBasicService.ts';
import type { PageResponse } from '../../../entities/PageResponse.ts';
import { parseError } from '../../../common/CommonFunctions.ts';
import type { FilterRequest } from '../../../entities/FilterRequest.ts';

function NamesMain() {
	const [names, setNames] = useState<PageResponse<ImdbNameBasic> | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	async function onPage(request: FilterRequest) {
		setLoading(true);

		request.page ??= 0;
		request.size ??= 10;

		if (!request.sort?.length) {
			request.sort = [{ field: 'id', order: 1 }];
		}

		try {
			setNames(await filterImdbNameBasics(request));
		} catch (e) {
			setNames(null);
			console.debug(parseError(e));
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		void onPage({});
	}, []);

	return (
		<div className="flex" style={{ width: '100%', height: '100%' }}>
			<NamesTable names={names} loading={loading} onPage={onPage} />
		</div>
	);
}

export default NamesMain;
