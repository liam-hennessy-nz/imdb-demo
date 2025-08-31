import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import * as fs from 'node:fs';
import * as path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const host = env.VITE_HOST;
	const port = parseInt(env.VITE_PORT, 10);
	const useTls = env.VITE_USE_TLS === 'true';
	const tlsKeyPath = env.VITE_TLS_KEY_PATH;
	const tlsCrtPath = env.VITE_TLS_CRT_PATH;

	return {
		server: {
			host: host,
			port: port,
			strictPort: true,
			https: useTls
				? {
						key: fs.readFileSync(path.resolve(__dirname, tlsKeyPath)),
						cert: fs.readFileSync(path.resolve(__dirname, tlsCrtPath)),
					}
				: undefined,
		},
		plugins: [
			react({
				babel: {
					plugins: [['babel-plugin-react-compiler']],
				},
			}),
			checker({
				typescript: true,
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
					useFlatConfig: true,
				},
			}),
		],
	};
});
