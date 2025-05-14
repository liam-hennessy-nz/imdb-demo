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
		extends: [
			js.configs.recommended,
			reactX.configs.recommended,
			reactDom.configs.recommended,
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
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
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'react-compiler': reactCompiler,
		},
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'prettier/prettier': 'error',
			'react-compiler/react-compiler': 'error',
			'react/react-in-jsx-scope': 'off',
			'react-x/no-unstable-context-value': 'off',
		},
	},
	prettierConfig,
]);
