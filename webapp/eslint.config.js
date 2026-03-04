import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		plugins: { prettier },
		extends: [
			js.configs.recommended,
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
			react.configs.flat.recommended,
			reactCompiler.configs.recommended,
			reactDom.configs.strict,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.recommended,
			reactRefresh.configs.vite,
			reactX.configs['strict-type-checked'],
		],
		languageOptions: {
			ecmaVersion: 2020,
			parserOptions: {
				projectService: true,
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'prettier/prettier': 'warn',
			'eqeqeq': ['error', 'always'],
			'no-console': 'warn',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
			'@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/strict-boolean-expressions': [
				'error',
				{
					allowString: false,
					allowNumber: false,
					allowNullableObject: false,
					allowNullableBoolean: true,
				},
			],
		},
	},
	prettierConfig,
]);
