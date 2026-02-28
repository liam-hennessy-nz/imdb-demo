import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
			'eqeqeq': ['error', 'always'],
			'no-console': 'warn',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-no-literals': 'off',
			'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
			'react-x/no-unstable-context-value': 'off',
			'@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
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
