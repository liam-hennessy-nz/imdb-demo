import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Fragment } from 'react';
import { useAppContext } from '../../app/context/AppContext.ts';
import type { DatasetKey } from '../../dataset/entity/Datasets.ts';
import { useUploadContext } from '../context/UploadContext.ts';
import type { Upload } from '../entity/Upload.ts';
import { assertUploadHasFile, assertUploadIsVisible } from '../service/uploadHelper.ts';
import { UploadItem } from './UploadItem.tsx';

export function UploadDrawer() {
	const { isUploadDrawerOpen, setUploadDrawerOpen } = useAppContext();
	const uploadCtx = useUploadContext();

	function handleDrawerClose() {
		setUploadDrawerOpen(false);
	}

	function uploadsTemplate() {
		const uploads = Object.entries(uploadCtx.uploads) as [DatasetKey, Upload][];
		return uploads.map(([datasetKey, upload], index) => {
			try {
				assertUploadHasFile(upload);
				assertUploadIsVisible(upload);
			} catch {
				return null;
			}

			const key = `${datasetKey}-upload-item`;
			return (
				<Fragment key={key}>
					<ListItem>
						<UploadItem datasetKey={datasetKey} upload={upload} />
						{index < uploads.length - 1 && <Divider />}
					</ListItem>
				</Fragment>
			);
		});
	}

	return (
		<Drawer open={isUploadDrawerOpen} onClose={handleDrawerClose} anchor="right">
			<List sx={{ width: 400 }}>
				<ListItem>Active Uploads</ListItem>
				{uploadsTemplate()}
			</List>
		</Drawer>
	);
}
