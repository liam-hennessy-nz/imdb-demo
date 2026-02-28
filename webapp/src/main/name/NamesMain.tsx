export function NamesMain() {
	/*	const [names, setNames] = useState<PageResponse<RawNameBasic> | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	async function onPage(request: FilterRequest) {
		setLoading(true);

		request.page ??= 0;
		request.size ??= 10;

		if (request.sort?.length === undefined) {
			request.sort = { ['id']: 1 };
		}

		try {
			setNames(await filterImdbNameBasics(request));
		} catch (ex) {
			setNames(null);
			devLog.error(`Failed to page 'names': ${parseErrorMessage(ex)}`);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		void onPage({});
	}, []);

	return (
		<div className="flex" style={{ width: '100%', height: '100%' }}>
			{/!*<NamesTable names={names} loading={loading} onPage={onPage} />*!/}
		</div>
	);*/
}
