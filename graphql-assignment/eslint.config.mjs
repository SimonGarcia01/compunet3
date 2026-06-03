// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tsParser from '@typescript-eslint/parser';

export default defineConfig([
    {
        ignores: ['dist/**', 'build/**', 'vite.config.ts', 'eslint.config.mjs'],
    },
    eslint.configs.recommended,
    {
        files: ['**/*.ts'],
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
                node: true,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'all',
                    argsIgnorePattern: '^_',
                },
            ],
            camelcase: 'off',
            'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                },
            ],
            'prettier/prettier': [
                'error',
                {},
                {
                    usePrettierrc: true,
                },
            ],
        },
    },
    {
        files: ['**/*.ts'],
        ...prettierRecommended,
    },
]);
