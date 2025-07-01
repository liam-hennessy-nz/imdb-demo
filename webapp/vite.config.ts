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
	const ksPath = env.VITE_KS_PATH;

	return {
		server: {
			host: host,
			port: port,
			https: useTls
				? {
						key: fs.readFileSync(path.resolve(__dirname, `${ksPath}/localhost.key`)),
						cert: fs.readFileSync(path.resolve(__dirname, `${ksPath}/localhost.crt`)),
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
