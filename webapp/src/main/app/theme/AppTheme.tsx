import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import { useAppContext } from '../context/AppContext.ts';

export function AppTheme({ children }: PropsWithChildren) {
	const appCtx = useAppContext();
	const theme = createTheme({ palette: { mode: appCtx.isDarkModeEnabled ? 'dark' : 'light' } });

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline>{children}</CssBaseline>
		</ThemeProvider>
	);
}
