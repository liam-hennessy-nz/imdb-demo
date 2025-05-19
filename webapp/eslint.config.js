import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier/flat';

export default tseslint.config([
	{ ignores: ['dist'] },
	{
		files: ['**/*.{ts,tsx}'],
		extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: {
			prettier,
			react,
			'react-refresh': reactRefresh,
			'react-hooks': reactHooks,
			'react-x': reactX,
			'react-dom': reactDom,
			'react-compiler': reactCompiler,
		},
		rules: {
			'prettier/prettier': 'warn',
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			...reactX.configs['recommended-typescript'].rules,
			...reactDom.configs.recommended.rules,
			...reactCompiler.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react-x/no-unstable-context-value': 'off',
		},
	},
	prettierConfig,
]);
